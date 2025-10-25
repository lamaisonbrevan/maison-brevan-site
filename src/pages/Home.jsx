// src/pages/home.jsx (extrait)
import { ROOMS, SITE } from "../data";

<section className="container-p my-16">
  <h2 className="text-2xl font-semibold mb-6">Nos chambres</h2>
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {ROOMS.map((room) => (
      <article key={room.id} className="rounded-2xl border p-3">
        <div className="aspect-[4/3] overflow-hidden rounded-xl mb-3">
          <img
            src={room.cover}
            alt={room.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <h3 className="font-medium">{room.name}</h3>
        <p className="text-sm text-stone-600">
          À partir de <strong>{room.priceFrom}€</strong> / nuit — {room.size} m²
        </p>
        <a
          href={SITE.bookingUrl}
          className="btn-primary mt-3 inline-block"
          target="_blank"
          rel="noreferrer"
        >
          Réserver
        </a>
      </article>
    ))}
  </div>
</section>
