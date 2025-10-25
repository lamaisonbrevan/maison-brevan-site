export default function Home() {
  const rooms = [
    { name: "Chambre cheminée",    price: 110, surface: 25, img: "cheminee-01.jpg" },
    { name: "Chambre baignoire",   price: 110, surface: 25, img: "baignoire-01.jpg" },
    { name: "Pierres bleues",      price: 100, surface: 20, img: "pierre-bleue-01.jpg" },
  ];

  return (
    <section id="home" className="container-p py-16">
      <h1 className="text-3xl font-semibold">Chambres d’hôtes de charme</h1>
      <p className="mt-2 text-stone-600 max-w-2xl">
        Une maison chaleureuse aux portes du canal de Nantes à Brest. Calme,
        lumière et authenticité.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {rooms.map(r => (
          <article key={r.name} className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
            <img
              src={`/images/chambres/${r.img}`}
              alt={r.name}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h3 className="text-lg font-medium">{r.name}</h3>
              <p className="mt-1 text-sm text-stone-600">
                à partir de <strong>{r.price}€</strong> / nuit — {r.surface} m²
              </p>
              <a href="#reserve" className="btn btn-primary mt-3 inline-block">Réserver</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
