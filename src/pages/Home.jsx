export default function Home() {
  return (
    <section id="home" className="pt-24">
      <div className="relative isolate bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Chambres d’hôtes de charme
          </h1>
          <p className="mt-3 max-w-xl text-gray-600">
            Une maison chaleureuse aux portes de la Côte d’Azur. Calme, lumière
            et authenticité.
          </p>

          <div className="mt-6">
            <a
              href="#reserver"
              className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium shadow-sm hover:shadow transition"
            >
              Voir les disponibilités
            </a>
          </div>
        </div>
      </div>

      {/* Aperçu des chambres (placeholder) */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {["Les Tonneaux", "Jardin Secret", "Atelier"].map((name) => (
          <article
            key={name}
            className="rounded-2xl border bg-white overflow-hidden"
          >
            <div className="aspect-[4/3] bg-gray-200" />
            <div className="p-4">
              <h3 className="font-medium">{name}</h3>
              <p className="mt-1 text-sm text-gray-600">
                À partir de <strong>155€</strong> / nuit
              </p>
              <a
                href="#reserver"
                className="mt-3 inline-block text-sm text-gray-700 underline-offset-2 hover:underline"
              >
                Réserver
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
