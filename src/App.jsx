import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Reserve from "./pages/Reserve";
import { useHashRouter } from "./router";
import { TEXTS } from "./i18n";
import "./index.css";
export default function App() {
  const { route, goto } = useHashRouter("home");
  const [lang, setLang] = useState("fr");
  const labels = useMemo(() => TEXTS[lang], [lang]);
  useEffect(() => { document.documentElement.lang = lang; document.title = "La Maison Brevan"; }, [lang]);
  return (
    <div className="min-h-screen flex flex-col">
      <Header goto={goto} lang={lang} setLang={setLang} labels={labels} />
      <main className="flex-1">
        {route === "home" && <Home labels={labels} goto={goto} />}
        {route === "gallery" && <Gallery labels={labels} />}
        {route === "reserve" && <Reserve labels={labels} />}
      </main>
      <footer className="border-t border-stone-200 py-8">
        <div className="container-p text-sm text-stone-600">© {new Date().getFullYear()} La Maison Brevan — Tous droits réservés.</div>
      </footer>
    </div>
  );
}
