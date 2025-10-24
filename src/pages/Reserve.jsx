export default function Reserve() {
  return (
    <section id="reserver" className="scroll-mt-20 max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-semibold">Réserver</h2>
      <p className="mt-2 text-gray-600">
        Intégrez ici votre moteur de réservation (ou un lien externe).
      </p>

      <div className="mt-6 rounded-2xl border p-4 bg-white">
        <p className="text-sm text-gray-500">
          Exemple (placeholder) : formulaire, calendrier, lien vers la
          plateforme, etc.
        </p>
        <a
          href="#"
          className="mt-4 inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium shadow-sm hover:shadow transition"
        >
          Réserver maintenant
        </a>
      </div>
    </section>
  );
}
