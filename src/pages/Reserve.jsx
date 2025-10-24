import { Container } from "../theme.jsx";

export default function Reserve() {
  return (
    <section id="reserve" className="pt-24">
      <Container className="py-12">
        <h2 className="text-xl md:text-2xl font-serif mb-4">Réserver</h2>
        <p className="opacity-80 mb-6">
          Ici on intégrera le moteur (Beds24/Booking/Expedia). Pour l’instant, un bouton :
        </p>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-block rounded-md px-4 py-2 border"
        >
          Voir les disponibilités
        </a>
      </Container>
    </section>
  );
}
