export default function Gallery() {
  // Liste tes fichiers placés dans public/images/chambres
  const photos = [
    { file: "baignoire-01.jpg",   alt: "Chambre baignoire" },
    { file: "cheminee-01.jpg",    alt: "Chambre cheminée" },
    { file: "pierre-bleue-01.jpg",alt: "Chambre pierres bleues" },
    { file: "ensoleillee-01.jpg", alt: "Chambre ensoleillée" },
    { file: "petite-01.jpg",      alt: "Petite chambre" },
  ];

  return (
    <section id="gallery" className="container-p py-16">
      <h2 className="text-2xl font-semibold">Galerie</h2>
      <p className="mt-2 mb-6 text-stone-600">
        Quelques vues de la maison et des chambres.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {photos.map(p => (
          <img
            key={p.file}
            src={`/images/chambres/${p.file}`}
            alt={p.alt}
            className="aspect-[4/3] w-full object-cover rounded-xl shadow-sm"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
