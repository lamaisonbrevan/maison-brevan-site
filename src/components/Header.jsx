export default function Header({ route, goto }) {
  const NAV = [
    { key: "home",    label: "Accueil"  },
    { key: "galerie", label: "Galerie"  },
    { key: "reserve", label: "Réserver" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/70 backdrop-blur border-b">
      <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="font-semibold tracking-wide">LA MAISON BREVAN</div>
        <div className="flex items-center gap-6">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => goto(n.key)}
              className={`text-sm ${route === n.key ? "font-semibold underline underline-offset-4" : "opacity-80 hover:opacity-100"}`}
            >
              {n.label}
            </button>
          ))}
          <span aria-hidden className="text-gray-300">|</span>
          <span className="text-sm">FR</span>
        </div>
      </nav>
    </header>
  );
}
