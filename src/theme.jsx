// Couleurs + petits utilitaires UI
export const COLORS = {
  encre: "#1a1a1a",
  sable: "#e7e0d8",
  argile: "#c8b8a5",
};

export function Container({ className = "", children }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 ${className}`}>{children}</div>;
}

// Anneau d'accessibilité (ne dépend pas d'une couleur custom Tailwind)
export const focusRing = "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";
