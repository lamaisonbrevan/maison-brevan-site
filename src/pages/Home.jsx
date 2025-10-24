import HeroSlider from "../components/HeroSlider";
import RoomsSection from "../components/RoomsSection";
import { SLIDES, ROOMS } from "../data";
export default function Home({ labels, goto }) {
  return (<>
    <HeroSlider images={SLIDES} title={labels.hero.title} ctaLabel={labels.hero.cta} onCta={() => goto("reserve")} />
    <RoomsSection title={labels.roomsTitle} rooms={ROOMS} onReserve={() => goto("reserve")} />
  </>);
}
