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
      <SectionTitle title="关于本项目"/>
      <p className="about-text text-neutral-900 text-[clamp(1.4rem,2vw,1.75rem)] text-center font-silka leading-[1.8] will-change-transform">本项目旨在构建一个基于以太坊 Layer2 的跨链 NFT 交易市场，充分利用 LayerZero 跨链协议的独特优势，实现不同区块链、不同协议 NFT 资产的安全、高效流通。通过 LayerZero 的跨链技术，我们能够将多个区块链的 NFT 资源汇聚于一个统一的交易平台，为用户提供丰富多样的数字资产交易体验。</p>
      <TechnologyStack />
    </div>
  )
}

export default About;