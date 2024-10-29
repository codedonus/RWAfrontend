import { useRef } from "react";
import { gsap, SplitText, ScrollTrigger } from "./gsap";
import SectionTitle from "./SectionTitle";
import TechnologyStack from "./TechnologyStack";
import useLayoutEffect from "./use-isomorpphic-layout-effect"

const About = () => {
  const el = useRef(null);
  const q = gsap.utils.selector(el);

  useLayoutEffect(() => {
    document.fonts.ready.then(function () {
      const split = new SplitText(q(".about-text"), {type:"lines,words", linesClass:"split-line"});

      const anim = gsap.from(split.lines,  {
        duration: 0.6,
        autoAlpha: 0,
        translateY: '100%',
        ease: 'circ.out',
        stagger: 0.05,
        paused: true
      });

      ScrollTrigger.create({
        trigger: '.about-text',
        start: 'top 80%',
        onEnter: () => anim.play(),
      }); 
    });
  }, [])

  return (
    <div ref={el} id="about" className="pb-40 w-full relative px-[10vw] 2xl:px-[12.5vw] bg-slate-100">
      <SectionTitle title="About"/>
      <p className="about-text text-neutral-900 text-[clamp(1.4rem,2vw,1.75rem)] text-center font-silka leading-[1.8] will-change-transform">RWAWrapper is an innovative NFT fractionalization protocol designed specifically for real-world assets (RWA). Our platform enables asset owners to tokenize and fractionalize physical assets like real estate, art, and commodities into NFTs, making them more accessible and liquid. </p>
      <TechnologyStack />
    </div>
  )
}

export default About;