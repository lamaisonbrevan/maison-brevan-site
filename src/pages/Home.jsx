export default function Home() {
  return (
    <section id="home" className="min-h-[70vh] relative flex items-end">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80&auto=format&fit=crop')",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50" aria-hidden="true" />

      <div className="container-p relative py-24 text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-6">
          Chambres d’hôtes de charme
        </h1>
        <a href="#reserve" className="btn-primary">Voir les disponibilités</a>
      </div>
    </section>
  );
}
