import useHashRouter from "./router.jsx";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Gallery from "./pages/Gallery.jsx";
import Reserve from "./pages/Reserve.jsx";
import Reserve from "./pages/Reserve.jsx";

export default function App() {
  const { route, goto } = useHashRouter("home");

  return (
    <>
      <Header route={route} goto={goto} />
      <main>
        {/* On rend TOUTES les sections; le menu scrolle vers la bonne */}
        <Home />
        <Gallery />
        <Reserve />
      </main>
    </>
  );
}
