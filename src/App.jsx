import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Gallery from "./pages/Gallery.jsx";
import Reserve from "./pages/Reserve.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main className="pt-[var(--header-height)]">
        <Home />
        <Gallery />
        <Reserve />
      </main>
    </>
  );
}
