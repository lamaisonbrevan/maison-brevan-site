// src/components/Header.jsx
import { useEffect, useState, useCallback } from "react";
import { ui } from "../theme";

const NAV = [
  { label: "GALERIE", hash: "#galerie" },
  { label: "RÉSERVER", hash: "#reserve" },
  { label: "ACTUALITÉS", hash: "#actus" },
  { label: "OFFRIR", hash: "#offrir" },
];

export default function Header() {
  const [active, setActive] = useState("");

  // active link from hash
  const sync = useCallback(() => setActive(window.location.hash || "#home"), []);
  useEffect(() => {
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [sync]);

  const goto = (hash) => {
    if (window.location.hash !== hash) window.location.hash = hash;
    // scroll to top of section
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        {/* Gauche : MENU (simple texte, comme sur la capture) */}
        <div className="uppercase tracking-[0.2em] text-[11px] text-black/50 select-none">
          Menu
        </div>

        {/* Centre : Logo / label */}
        <div className="text-[11px] tracking-[0.4em] uppercase px-3 py-1 border border-black/20 bg-white/80 backdrop-blur-sm">
          LA MAISON BREVAN
        </div>

        {/* Droite : NAV + langues */}
        <nav className="flex items-center gap-6">
          {NAV.map((item) => {
            const isActive = active === item.hash;
            return (
              <button
                key={item.hash}
                onClick={() => goto(item.hash)}
                className={isActive ? ui.linkActive : ui.link}
              >
                {item.label}
              </button>
            );
          })}

          <span className="text-black/30">|</span>

          {/* FR / EN toggle minimal */}
          <LangSwitch />
        </nav>
      </div>
    </header>
  );
}

function LangSwitch() {
  const [lang, setLang] = useState("fr");
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="flex items-center gap-2">
      <button
        className={lang === "fr" ? "font-semibold text-black" : "text-black/60"}
        onClick={() => setLang("fr")}
      >
        FR
      </button>
      <span className="text-black/30">·</span>
      <button
        className={lang === "en" ? "font-semibold text-black" : "text-black/60"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );
}
