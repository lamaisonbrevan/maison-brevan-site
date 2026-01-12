import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PAGES = {
    "index.html": {
        "canonical": "https://lamaisonbrevan.fr/",
        "title": "Chambres d’hôtes à Châteaulin – La Maison Brevan",
        "description": "La Maison Brevan propose des chambres d’hôtes de charme à Châteaulin, dans le Finistère : suites élégantes, matériaux naturels, accueil chaleureux et proximité de la nature.",
    },
    "autour.html": {
        "canonical": "https://lamaisonbrevan.fr/autour.html",
        "title": "Autour de Châteaulin – La Maison Brevan",
        "description": "Explorez Châteaulin et le Finistère depuis La Maison Brevan : nature, plages, patrimoine et villages bretons à découvrir autour de nos chambres d’hôtes.",
    },
    "gallery.html": {
        "canonical": "https://lamaisonbrevan.fr/gallery.html",
        "title": "Galerie – Chambres et maison d’hôtes La Maison Brevan à Châteaulin",
        "description": "Parcourez la galerie photo de La Maison Brevan : découvrez nos chambres, les espaces communs et l’atmosphère unique de notre maison d’hôtes à Châteaulin.",
    },
    "cgv.html": {
        "canonical": "https://lamaisonbrevan.fr/cgv.html",
        "title": "Conditions générales de vente – La Maison Brevan",
        "description": "Consultez les conditions générales de vente et d’annulation de La Maison Brevan pour vos réservations de chambres d’hôtes.",
    },
    "confidentialite.html": {
        "canonical": "https://lamaisonbrevan.fr/confidentialite.html",
        "title": "Politique de confidentialité – La Maison Brevan",
        "description": "Politique de confidentialité de La Maison Brevan : informations sur la collecte et le traitement de vos données lors de la réservation ou de la navigation.",
    },
    "cookies.html": {
        "canonical": "https://lamaisonbrevan.fr/cookies.html",
        "title": "Politique cookies – La Maison Brevan",
        "description": "Politique d’utilisation des cookies de La Maison Brevan : découvrez comment nous utilisons les cookies et comment les gérer lors de votre visite.",
    },
    "mentions.html": {
        "canonical": "https://lamaisonbrevan.fr/mentions.html",
        "title": "Mentions légales – La Maison Brevan",
        "description": "Mentions légales de La Maison Brevan : informations juridiques, propriété du site et coordonnées de contact.",
    },
}

LANDING_FILE = "chambre-hotes-chateaulin.html"
LANDING_CANONICAL = f"https://lamaisonbrevan.fr/{LANDING_FILE}"

JSONLD_BASE = r'''{
  "@context": "https://schema.org",
  "@type": "BedAndBreakfast",
  "@id": "https://lamaisonbrevan.fr/#maison-brevan",
  "name": "La Maison Brevan",
  "url": "https://lamaisonbrevan.fr/",
  "telephone": "+33 7 62 57 69 58",
  "email": "contact@lamaisonbrevan.fr",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "29 Grand Rue",
    "addressLocality": "Châteaulin",
    "postalCode": "29150",
    "addressRegion": "Bretagne",
    "addressCountry": "FR"
  },
  "image": [
    "https://lamaisonbrevan.fr/assets/images/logo-symbol.png"
  ],
  "sameAs": [
    "https://www.instagram.com/maisonbrevan/",
    "https://www.facebook.com/profile.php?id=61585826054527"
  ]
}'''

def _update_head(html: str, title: str, desc: str, canonical: str) -> str:
    m = re.search(r"<head[^>]*>(.*?)</head>", html, flags=re.I | re.S)
    if not m:
        return html

    head = m.group(1)

    # Title
    if re.search(r"<title>.*?</title>", head, flags=re.I | re.S):
        head = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", head, flags=re.I | re.S)
    else:
        head = f"<title>{title}</title>" + head

    # Remove any existing meta description(s)
    head = re.sub(r"<meta[^>]*name=[\"']description[\"'][^>]*>", "", head, flags=re.I)

    # Insert meta description after title
    head = re.sub(
        r"(<title>.*?</title>)",
        r"\1" + f'<meta name="description" content="{desc}">',
        head,
        count=1,
        flags=re.I | re.S,
    )

    # Remove existing canonical(s)
    head = re.sub(r"<link[^>]*rel=[\"']canonical[\"'][^>]*>", "", head, flags=re.I)

    # Remove our previous JSON-LD block if present (identified by @id)
    head = re.sub(
        r"<script[^>]*type=[\"']application/ld\+json[\"'][^>]*>.*?</script>",
        lambda match: "" if "https://lamaisonbrevan.fr/#maison-brevan" in match.group(0) else match.group(0),
        head,
        flags=re.I | re.S,
    )

    inject = (
        f'\n<link rel="canonical" href="{canonical}">'\
        f'\n<script type="application/ld+json">\n{JSONLD_BASE}\n</script>\n'
    )

    head = head + inject
    return html[: m.start(1)] + head + html[m.end(1) :]

def _add_footer_link_to_landing(index_html: str) -> str:
    if LANDING_FILE in index_html:
        return index_html

    # Try to append after first CGV link
    pattern = r'(href=[\"'](?:/)?cgv\.html[\"'][^>]*>.*?</a>)'
    if re.search(pattern, index_html, flags=re.I | re.S):
        return re.sub(
            pattern,
            r'\1 | <a href="/' + LANDING_FILE + r'">Chambre d’hôtes Châteaulin</a>',
            index_html,
            count=1,
            flags=re.I | re.S,
        )

    # Fallback: insert before </footer>
    if re.search(r"</footer>", index_html, flags=re.I):
        return re.sub(
            r"</footer>",
            f' | <a href="/{LANDING_FILE}">Chambre d’hôtes Châteaulin</a></footer>',
            index_html,
            count=1,
            flags=re.I,
        )

    return index_html

def _extract_stylesheets(html: str) -> str:
    m = re.search(r"<head[^>]*>(.*?)</head>", html, flags=re.I | re.S)
    if not m:
        return ""
    head = m.group(1)
    links = re.findall(r"<link[^>]*rel=[\"']stylesheet[\"'][^>]*>", head, flags=re.I)
    return "\n  ".join(links)

def write_landing_from_index(index_html: str) -> None:
    css_links = _extract_stylesheets(index_html)

    landing = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Chambre d’hôtes à Châteaulin – La Maison Brevan</title>
  <meta name="description" content="Séjournez à Châteaulin à La Maison Brevan : chambres d’hôtes de charme, emplacement central et accès facile aux sites du Finistère.">
  <link rel="canonical" href="{LANDING_CANONICAL}">
  {css_links}
  <script type="application/ld+json">
{JSONLD_BASE}
  </script>
</head>
<body>
  <p><a href="/">← Retour à l’accueil</a></p>
  <h1>Chambre d’hôtes à Châteaulin</h1>
  <p>Bienvenue à La Maison Brevan, maison d’hôtes située au cœur de Châteaulin (Finistère). Séjournez dans un cadre chaleureux et raffiné, idéal pour explorer la Bretagne.</p>

  <h2>Accès et localisation</h2>
  <p>Adresse : 29 Grand Rue, 29150 Châteaulin. À proximité : canal de Nantes à Brest, presqu’île de Crozon, baie de Douarnenez, Monts d’Arrée.</p>

  <h2>Services</h2>
  <p>Wi‑Fi gratuit, chambres non‑fumeur, literie haut de gamme. Petit‑déjeuner proposé sur réservation.</p>

  <p>Réservation : <a href="tel:+33762576958">+33 7 62 57 69 58</a> — <a href="mailto:contact@lamaisonbrevan.fr">contact@lamaisonbrevan.fr</a></p>
</body>
</html>
"""
    (ROOT / LANDING_FILE).write_text(landing, encoding="utf-8")

def write_sitemap() -> None:
    urls = [
        "https://lamaisonbrevan.fr/",
        "https://lamaisonbrevan.fr/autour.html",
        "https://lamaisonbrevan.fr/gallery.html",
        "https://lamaisonbrevan.fr/cgv.html",
        "https://lamaisonbrevan.fr/confidentialite.html",
        "https://lamaisonbrevan.fr/cookies.html",
        "https://lamaisonbrevan.fr/mentions.html",
        LANDING_CANONICAL,
    ]
    xml = ["<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
           "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"]
    for u in urls:
        xml.append("  <url>")
        xml.append(f"    <loc>{u}</loc>")
        xml.append("  </url>")
    xml.append("</urlset>\n")
    (ROOT / "sitemap.xml").write_text("\n".join(xml), encoding="utf-8")

def main():
    # Update all listed pages
    for filename, meta in PAGES.items():
        path = ROOT / filename
        if not path.exists():
            continue
        html = path.read_text(encoding="utf-8", errors="ignore")

        # For index.html: also ensure footer link exists
        if filename == "index.html":
            html = _add_footer_link_to_landing(html)

        html = _update_head(html, meta["title"], meta["description"], meta["canonical"])
        path.write_text(html, encoding="utf-8")

    # Create landing page + sitemap
    index_path = ROOT / "index.html"
    if index_path.exists():
        write_landing_from_index(index_path.read_text(encoding="utf-8", errors="ignore"))
    else:
        # If index missing, still write a landing without css links
        write_landing_from_index("")

    write_sitemap()

if __name__ == "__main__":
    main()
