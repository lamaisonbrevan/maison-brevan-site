// src/components/HeroSlider.jsx
import { ui } from "../theme";

const HERO =
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=2000&auto=format&fit=crop"; // mets ici ta photo

export default function HeroSlider() {
  return (
    <section id="home" className="relative h-[90vh] min-h-[560px] w-full">
      {/* Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO})` }}
        aria-hidden="true"
      />

      {/* Overlay très clair */}
      <div className="absolute inset-0 bg-white/70" aria-hidden="true" />

      {/* Texte centré bas */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 text-center">
        <h1 className="mb-5 text-[14px] tracking-[0.4em] uppercase text-black/70">
          Chambres d’hôtes de charme
        </h1>

        <a href="#reserve" className={ui.btn}>
          Voir les disponibilités
        </a>
      </div>
    </section>
  );
}
