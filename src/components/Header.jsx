export default function Header({ route, goto }) {
  const link = (name, label) => (
    <a
      href={`#${name}`}
      onClick={(e) => {
        e.preventDefault();
        goto(name);
      }}
      className={
        "transition-colors " +
        (route === name ? "text-black" : "text-gray-500 hover:text-black")
      }
    >
      {label}
    </a>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto h-14 px-4 flex items-center justify-between">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            goto("home");
          }}
          className="text-sm font-semibold tracking-widest"
        >
          LA MAISON BREVAN
        </a>

        <nav className="flex items-center gap-6 text-sm">
          {link("home", "Accueil")}
          {link("galerie", "Galerie")}
          {link("reserver", "Réserver")}
          <span className="text-gray-300 select-none">|</span>
          <button
            className="text-gray-500 hover:text-black"
            title="Langue"
            onClick={() => alert("FR uniquement pour l’instant")}
          >
            FR
          </button>
        </nav>
      </div>
    </header>
  );
}
