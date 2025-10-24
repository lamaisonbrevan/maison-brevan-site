export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-stone-200">
      <nav className="container-p h-[var(--header-height)] flex items-center justify-between">
        <a href="#home" className="font-medium tracking-wide">LA MAISON BREVAN</a>
        <ul className="flex items-center gap-6 text-sm">
          <li><a href="#home" className="link">Accueil</a></li>
          <li><a href="#gallery" className="link">Galerie</a></li>
          <li><a href="#reserve" className="btn">Réserver</a></li>
          <li className="text-stone-400">|</li>
          <li><button className="text-xs">FR</button></li>
        </ul>
      </nav>
    </header>
  );
}
