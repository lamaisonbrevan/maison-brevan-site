// src/pages/Home.jsx
import { CHAMBRES } from "../donnees.js";

export default function Home() {
  return (
    <section id="home" className="container-p py-12">
      <h2 className="text-2xl font-semibold mb-6">Chambres d’hôtes de charme</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CHAMBRES.map((c) => (
          <article key={c.id} className="rounded-2xl border p-4">
            <img src={c.cover} alt={c.nom}
                 className="w-full aspect-[4/3] object-cover rounded-xl mb-3" />
            <h3 className="font-medium">{c.nom}</h3>
            <p className="text-sm text-stone-600">
              à partir de {c.prix}€ / nuit — {c.surface} m²
            </p>
            <a href="#reserve" className="btn mt-3">Réserver</a>
          </article>
        ))}
      </div>
    </section>
  );
}
