import { useState, useEffect, useCallback } from "react";
const ALLOWED = ["home", "gallery", "reserve"];
export function useHashRouter(defaultRoute = "home") {
  const getRoute = () => { const h = (window.location.hash || "#home").replace("#", ""); return ALLOWED.includes(h) ? h : defaultRoute; };
  const [route, setRoute] = useState(getRoute());
  useEffect(() => { const handler = () => setRoute(getRoute()); window.addEventListener("hashchange", handler); return () => window.removeEventListener("hashchange", handler); }, []);
  const goto = useCallback((r) => { const safe = ALLOWED.includes(r) ? r : defaultRoute; if (window.location.hash !== `#${safe}`) { window.location.hash = safe; } else { window.scrollTo({ top: 0, behavior: "smooth" }); } }, []);
  return { route, goto };
}
export default function Router({ routes, defaultRoute = "home" }) {
  const { route } = useHashRouter(defaultRoute);
  const Page = routes[route] || routes[defaultRoute];
  return <Page />;
}
