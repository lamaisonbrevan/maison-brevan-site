import { Container } from "../theme";
import { GALLERY } from "../data";
export default function Gallery() {
  return (
    <section className="py-12">
      <Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GALLERY.map((url) => (<img key={url} src={url} alt="" className="rounded-xl object-cover w-full h-64" />))}
        </div>
      </Container>
    </section>
  );
}
