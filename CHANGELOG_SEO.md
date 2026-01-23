# Changelog – Audit SEO & nettoyage (janv. 2026)

## SEO / Indexation
- Ajout de `meta robots` **noindex,follow** (et `googlebot`) sur les pages légales :
  - `cookies.html`
  - `mentions.html`
  - `confidentialite.html`
  - `cgv.html`
  Objectif : éviter que ces pages (peu utiles en SEO) ressortent dans Google à la place de la home.

- Mise à jour de `sitemap.xml` : ne contient plus que les pages à indexer (home + pages “contenu”).
  Objectif : concentrer l’exploration de Google sur les pages importantes.

- Harmonisation des liens internes vers la home :
  - remplacement des liens `index.html#...` par `/#...` sur l’ensemble du site
  - dans `script.js`, la fonction `scrollToTop()` redirige désormais vers `/` (au lieu de `index.html`)
  Objectif : réduire les URL “doublons” (`/` vs `/index.html`) et améliorer la canonisation.

## Correctifs techniques / propreté
- Ajout d’un vrai `favicon.ico` à la racine (cohérent avec les balises déjà présentes dans les pages).
- Ajout de la balise favicon sur les pages qui ne l’avaient pas encore.

## Notes
- Aucune modification visuelle voulue : ces changements sont “SEO / technique” et n’impactent pas le design.

## Cookies / tracking
- Mise à jour du texte “Cookies” (pages `cookies.html` et `confidentialite.html`) pour refléter l’état actuel du site : **pas d’outil de mesure d’audience / tracking installé**.

## Vercel (si déploiement Vercel)
- Ajout d’un `vercel.json` :
  - redirection 301 ` /index.html → /`
  - en-têtes `X-Robots-Tag: noindex, follow` sur les pages légales (renfort du meta robots)
