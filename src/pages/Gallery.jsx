import { Container } from "../theme.jsx";

export default function Gallery() {
  return (
    <section id="galerie" className="pt-24">
      <Container className="py-12">
        <h2 className="text-xl md:text-2xl font-serif mb-4">Galerie</h2>
        <p className="opacity-80 mb-6">Ici on mettra un slider/une grille d’images.</p>
        {/* place tes images ici */}
      </Container>
    </section>
  );
}
