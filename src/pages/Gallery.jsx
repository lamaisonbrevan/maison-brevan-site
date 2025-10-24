export default function Gallery() {
  const imgs = [1,2,3,4,5,6].map(
    (i) =>
      `https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80&auto=format&fit=crop&ix=${i}`
  );

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="container-p">
        <h2 className="text-2xl font-semibold mb-8">Galerie</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {imgs.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="rounded-xl object-cover aspect-[4/3]"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
