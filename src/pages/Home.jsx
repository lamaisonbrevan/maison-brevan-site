import { Container } from "../theme.jsx";

export default function Home() {
  return (
    <section id="home" className="pt-24">
      <Container className="py-12">
        <h1 className="text-2xl md:text-3xl font-serif mb-4">Chambres d’hôtes de charme</h1>
        <p className="max-w-2xl opacity-80">
          Présentation rapide de la maison… (tu mettras ton texte ici).
        </p>
      </Container>
    </section>
  );
}
