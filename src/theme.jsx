// src/theme.jsx

// Couleurs utilisées dans l'app
export const COULEURS = {
  encre: "#1a1a1a",
  sable: "#e7e0d8",
  argile: "#c8b8a5"
};

// Petit composant conteneur
export function Container({ className = "", children }) {
  return <div className={`container-p ${className}`}>{children}</div>;
}

// Styles d'anneau de focus (tailwind)
export const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2";
