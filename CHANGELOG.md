# La Maison Brevan - Correctifs & optimisations

Date : 2026-01-15

## Correctifs demandés

### Responsive mobile : prix
- Suppression de l'effet "une lettre par span" sur les badges de prix (cela provoquait des coupures type "nui" + "t").
- Ajout d'un style CSS pour garder le prix sur une seule ligne : `white-space: nowrap` + `flex-shrink: 0`.
- Le header de carte (.room-header) peut maintenant se replier proprement (wrap) sans casser le badge de prix.

### Prix : +5 EUR partout
- Mise a jour des prix dans `lang.js` (FR/EN/ES/DE).
- Mise a jour des textes de secours dans `index.html` (si JS desactive).

### Petit dejeuner inclus
- Ajout de la mention "Petit dejeuner inclus" sous le descriptif de chaque chambre.
- Ajout d'une icone SVG legere : `assets/icons/breakfast.svg`.
- Nouveau libelle traduit : `amenity.breakfastIncluded`.

### Centrage "La Maison Brevan" sur mobile
- Ajustement des styles mobiles du badge `.site-title-badge` (padding symetrique + suppression d'un margin-right qui decalait le centre).

### Carrousels / swipe
- Amelioration de la fonction de swipe (axis-lock) : on ne bloque le scroll vertical que si le geste est horizontal.
- L'autoplay est mis en pause uniquement quand l'utilisateur commence un swipe horizontal.
- Ajout de `touch-action: pan-y` sur les conteneurs de carrousel (hero, rooms, overlays) pour une meilleure gestion mobile.

### Galerie
- Suppression complete du texte en haut de la page Galerie.
- Nettoyage du HTML : la grille est generee par `gallery.js` (pas de duplication de thumbnails en dur).

### Double chargement
- Correction de `transition.js` : le code `pageshow` ne rejoue l'animation que lors d'un retour depuis le bfcache (`event.persisted`).

## Fichiers modifies (principaux)
- `index.html`
- `gallery.html`
- `style.css`
- `script.js`
- `transition.js`
- `lang.js`
- `cgv.html`, `confidentialite.html`, `cookies.html`, `mentions.html` (transition.js en defer)
- `assets/icons/breakfast.svg`

## Notes perf images
- Preload de la premiere image hero (LCP) sur la home.
- Chargement eager du logo (au-dessus de la ligne de flottaison).
- Les images non critiques conservent `loading="lazy"`.
