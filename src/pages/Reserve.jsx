import { Container } from "../theme";
export default function Reserve({ labels }) {
  return (
    <section className="py-12">
      <Container className="space-y-4">
        <h1 className="font-serif text-3xl">{labels.reserveIntro}</h1>
        <p className="text-stone-700">{labels.reserveNote}</p>
        <a href="https://secure.reservit.com/" target="_blank" rel="noopener noreferrer" className="btn-primary">
          {labels.openBooking}
        </a>
      </Container>
    </section>
  );
}
