import { GALLERY } from "../data";

<section className="container-p my-16">
  <h2 className="text-2xl font-semibold mb-6">Galerie</h2>
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {GALLERY.map((src, i) => (
      <div key={i} className="aspect-[4/3] overflow-hidden rounded-2xl">
        <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
      </div>
    ))}
  </div>
</section>
