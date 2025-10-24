export default function Reserve() {
  const rooms = [
    {
      title: "Les Tonneaux",
      price: "165€",
      img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80&auto=format&fit=crop",
    },
    {
      title: "Jardin Secret",
      price: "155€",
      img: "https://images.unsplash.com/photo-1560067174-8947b3b5a2c6?w=1200&q=80&auto=format&fit=crop",
    },
    {
      title: "Atelier",
      price: "155€",
      img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80&auto=format&fit=crop",
    },
  ];

  return (
    <section id="reserve" className="py-16 bg-stone-50">
      <div className="container-p">
        <h2 className="text-2xl font-semibold mb-8">Nos chambres</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r, i) => (
            <article
              key={i}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm"
            >
              <img src={r.img} alt="" className="w-full h-48 object-cover" />
              <div className="p-4 space-y-3">
                <h3 className="font-medium">{r.title}</h3>
                <p className="text-sm text-stone-600">
                  À partir de <span className="font-semibold">{r.price}</span> / nuit
                </p>
                <a
                  href="#"
                  className="btn w-full justify-center"
                >
                  Réserver
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
