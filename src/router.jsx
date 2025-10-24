import { useEffect, useState, useCallback } from "react";

const ALLOWED = ["home", "galerie", "reserve"];

export default function useHashRouter(defaultRoute = "home") {
  const [route, setRoute] = useState(defaultRoute);

  const apply = useCallback(() => {
    let h = (window.location.hash || "#home").replace("#", "");
    if (h === "reserver") h = "reserve"; // alias
    setRoute(ALLOWED.includes(h) ? h : "home");
  }, []);

  useEffect(() => {
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [apply]);

  const goto = useCallback((p) => {
    if (p === "reserver") p = "reserve";
    if (!ALLOWED.includes(p)) p = "home";
    if (window.location.hash !== `#${p}`) window.location.hash = `#${p}`;
    const el = document.getElementById(p);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return { route, goto };
}
