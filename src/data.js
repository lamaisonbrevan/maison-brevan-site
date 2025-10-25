// src/data.js
export const SITE = {
  name: "La Maison Brevan",
  slogan: "Chambres d’hôtes de charme",
  pitch:
    "Une maison chaleureuse aux portes du canal de Nantes à Brest. Calme, lumière et authenticité.",
  phone: "+33 7 62 57 69 58",
  email: "contact@lamaisonbrevan.fr",
  address: "29 Grand Rue, 29150 Châteaulin",
  // Remplace ce lien par ton vrai lien de réservation dès que tu l'as
  reservationUrl: "https://secure.reservit.com/",
};

export const ROOMS = [
  {
    slug: "cheminee",
    name: "La chambre cheminée",
    priceFrom: 110,
    size: 25,
    features: [
      "Cheminée foyer gaz",
      "Produits d’accueil naturels",
      "Petit-déjeuner en chambre",
      "Lit king size",
      "Douche italienne",
      "Sèche-cheveux",
      "Miroir grossissant",
      "Wi-Fi haut débit",
      "TV QLED 55\"",
      "Canal+"
    ],
    images: [
      "/images/chambres/cheminee-01.jpg",
      "/images/chambres/cheminee-02.jpg",
      "/images/chambres/cheminee-03.jpg",
    ],
  },
  {
    slug: "baignoire",
    name: "La chambre baignoire",
    priceFrom: 110,
    size: 25,
    features: [
      "Produits d’accueil naturels",
      "Petit-déjeuner en chambre",
      "Lit king size",
      "Douche italienne",
      "Baignoire",
      "Sèche-cheveux",
      "Miroir grossissant",
      "Wi-Fi haut débit",
      "TV QLED 55\"",
      "Canal+"
    ],
    images: [
      "/images/chambres/baignoire-01.jpg",
      "/images/chambres/baignoire-02.jpg",
      "/images/chambres/baignoire-03.jpg",
    ],
  },
  {
    slug: "pierres-bleues",
    name: "La chambre pierres bleues",
    priceFrom: 100,
    size: 20,
    features: [
      "Produits d’accueil naturels",
      "Petit-déjeuner en chambre",
      "Lit king size",
      "Douche italienne",
      "Sèche-cheveux",
      "Miroir grossissant",
      "Wi-Fi haut débit",
      "TV QLED 55\"",
      "Canal+"
    ],
    images: [
      "/images/chambres/pierres-bleues-01.jpg",
      "/images/chambres/pierres-bleues-02.jpg",
      "/images/chambres/pierres-bleues-03.jpg",
    ],
  },
  {
    slug: "ensoleillee",
    name: "La plus ensoleillée",
    priceFrom: 90,
    size: 18,
    features: [
      "Produits d’accueil naturels",
      "Petit-déjeuner en chambre",
      "Lit king size",
      "Douche italienne",
      "Sèche-cheveux",
      "Miroir grossissant",
      "Wi-Fi haut débit",
      "TV QLED 50\"",
      "Canal+"
    ],
    images: [
      "/images/chambres/ensoleillee-01.jpg",
      "/images/chambres/ensoleillee-02.jpg",
      "/images/chambres/ensoleillee-03.jpg",
    ],
  },
  {
    slug: "petite",
    name: "La plus petite",
    priceFrom: 90,
    size: 16,
    features: [
      "Produits d’accueil naturels",
      "Petit-déjeuner en chambre",
      "Lit king size",
      "Douche italienne",
      "Sèche-cheveux",
      "Miroir grossissant",
      "Wi-Fi haut débit",
      "TV QLED 55\"",
      "Canal+"
    ],
    images: [
      "/images/chambres/petite-01.jpg",
      "/images/chambres/petite-02.jpg",
      "/images/chambres/petite-03.jpg",
    ],
  },
];

// Images de la galerie générale (remplace/complète librement)
export const GALLERY = [
  "/images/galerie/01.jpg",
  "/images/galerie/02.jpg",
  "/images/galerie/03.jpg",
  "/images/galerie/04.jpg",
  "/images/galerie/05.jpg",
  "/images/galerie/06.jpg",
];
