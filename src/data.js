// src/donnees.js

// Cartes des 3 chambres affichées en haut de la page d'accueil
export const CHAMBRES = [
  {
    id: "cheminee",
    nom: "Chambre cheminée",
    prix: 110,
    surface: 25,
    cover: "/images/chambres/cheminee-01.jpg", // ← mets le 1er visuel dispo
  },
  {
    id: "baignoire",
    nom: "Chambre baignoire",
    prix: 110,
    surface: 25,
    cover: "/images/chambres/baignoire-01.jpg",
  },
  {
    id: "pierres",
    nom: "Pierres bleues",
    prix: 100,
    surface: 20,
    // temporaire : si tu n’as pas encore de photo “pierres”, réutilise une autre
    cover: "/images/chambres/cheminee-01.jpg",
  },
];

// Galerie (mets seulement les fichiers qui existent vraiment)
export const GALERIE = [
  "/images/chambres/cheminee-01.jpg",
  "/images/chambres/cheminee-02.jpg",
  "/images/chambres/cheminee-03.jpg",
  "/images/chambres/baignoire-01.jpg",
  "/images/chambres/baignoire-02.jpg",
  "/images/chambres/baignoire-03.jpg",
  // ajoute/retire des lignes selon ce que tu as réellement uploadé
];
