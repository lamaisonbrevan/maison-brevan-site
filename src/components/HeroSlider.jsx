import { useEffect, useState } from "react";
export default function HeroSlider({ images = [], title = "", ctaLabel = "", onCta }) {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((p) => (p + 1) % images.length), 4500); return () => clearInterval(id); }, [images.length]);
  return (
    <section className="relative h-[60vh] min-h-[380px]">
      {images.map((url, idx) => (
        <div key={url} className="absolute inset-0 transition-opacity duration-700" style={{backgroundImage:`url(${url})`, backgroundSize:"cover", backgroundPosition:"center", opacity: idx===i?1:0}} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/0" />
      <div className="container-p relative z-10 h-full flex items-end pb-10">
        <div className="text-white">
          <h1 className="font-serif text-3xl sm:text-4xl mb-4 drop-shadow">{title}</h1>
          {ctaLabel && (<button onClick={onCta} className="btn-primary">{ctaLabel}</button>)}
        </div>
      </div>
    </section>
  );
}
