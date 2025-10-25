// src/pages/Gallery.jsx
import { GALERIE } from "../donnees.js";

export default function Gallery() {
  return (
    <section id="gallery" className="container-p py-12">
      <h2 className="text-2xl font-semibold mb-6">Galerie</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {GALERIE.map((src, i) => (
          <img key={i} src={src} alt={`Photo ${i + 1}`}
               className="w-full aspect-[4/3] object-cover rounded-xl" />
        ))}
      </div>
    </section>
  );
}
