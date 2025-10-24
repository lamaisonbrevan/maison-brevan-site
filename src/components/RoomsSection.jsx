import { Container } from "../theme";
export default function RoomsSection({ title, rooms = [], onReserve }) {
  return (
    <section className="py-12">
      <Container>
        <h2 className="font-serif text-2xl mb-6">{title}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r) => (
            <article key={r.slug} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200">
              <img src={r.image} alt={r.name} className="h-48 w-full object-cover" />
              <div className="p-4 space-y-2">
                <h3 className="font-medium">{r.name}</h3>
                <p className="text-sm text-stone-600">{r.bed} — {r.size}</p>
                <ul className="text-sm text-stone-600 list-disc list-inside">
                  {r.features.map((f) => (<li key={f}>{f}</li>))}
                </ul>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-stone-700 text-sm">à partir de <strong>{r.priceFrom}€</strong> / nuit</span>
                  <button onClick={onReserve} className="btn">Réserver</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
