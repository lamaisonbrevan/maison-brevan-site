export default function Gallery() {
  return (
    <section id="galerie" className="scroll-mt-20 max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-semibold">Galerie</h2>
      <p className="mt-2 text-gray-600">
        Quelques vues (placeholders). On remplacera par tes vraies photos.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl" />
        ))}
      </div>
    </section>
  );
}
