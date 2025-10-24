import { focusRing } from "../theme";
export default function Header({ goto, lang, setLang, labels }) {
  const Item = ({ to, children }) => (
    <button onClick={() => goto(to)} className={`px-3 py-2 rounded-xl hover:bg-stone-100 ${focusRing}`}>{children}</button>
  );
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-stone-200">
      <div className="container-p h-[var(--header-height)] flex items-center justify-between">
        <div className="font-serif tracking-widest text-sm">LA MAISON BREVAN</div>
        <nav className="flex items-center gap-1">
          <Item to="home">{labels.menu.home}</Item>
          <Item to="gallery">{labels.menu.gallery}</Item>
          <Item to="reserve">{labels.menu.reserve}</Item>
          <div className="w-px h-5 bg-stone-300 mx-2" />
          <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} className={`px-3 py-2 rounded-xl hover:bg-stone-100 ${focusRing}`} title="Changer de langue / Switch language">
            {lang.toUpperCase()}
          </button>
        </nav>
      </div>
    </header>
  );
}
