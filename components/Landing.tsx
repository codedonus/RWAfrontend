import { useRef } from "react";
import { gsap, SplitText } from "./gsap";
import useLayoutEffect from "./use-isomorpphic-layout-effect"
import Link from "next/link";

const Landing = ({ scrollTo }: { scrollTo: (id: string) => void }) => {
    const el = useRef(null);
    const q = gsap.utils.selector(el);
    const tl = useRef(gsap.timeline())

    useLayoutEffect(() => {
        const name = new SplitText(q(".landing-name"), { type:"words"});
        const sub = new SplitText(q(".landing-sub"), { type:"words"});

        tl.current.fromTo(name.words, {translateY: 120, autoAlpha: 0}, {autoAlpha: 1, translateY: 0, duration: 1.3, stagger: 0.04, ease: "back.out"}, 2.2);
        tl.current.fromTo(sub.words, {translateY: 140, autoAlpha: 0}, {autoAlpha: 1, translateY: 0, duration: 1.3, stagger: 0.02, ease: "back.out"}, 2.2);

        tl.current.to(q(".landing-arrow"), {translateY: -100, scale: 1, duration: 1, ease: "power2.inOut"}, 1.8);
        tl.current.to(q(".landing-arrow"), {rotateZ: 1080, duration: 1.9, ease: "power3.out"}, 1.8);
        tl.current.to(q(".landing-arrow"), {translateY: 0, duration: 0.9, ease: "power2.in"}, 2.7);

        tl.current.to(q(".landing-arrow"), {translateY: -30, duration: 0.6, ease: "power2.out", repeat: -1, yoyo: true}, 3.6);
    }, [])

    return (
        <div id="home" ref={el} className="w-full h-[115vh] relative bg-gradient-animation min-h-screen">
            <div className="landing-title flex flex-col items-center absolute top-[25%] w-full text-neutral-950" data-speed="0.6">
                <h1 className="landing-name text-[clamp(60px,7vw,135px)] font-[600]">RWAWrapper</h1>
                <h2 className="landing-sub pb-10 text-[clamp(20px,2vw,32px)]">RWA NFT Fractionalization Protocol</h2>
                <Link href="/mint">
                    <button className="rounded-xl px-8 py-3 text-neutral-100 font-[500] transition tracking-wide w-[200px] outline-none bg-blue-600 hover:bg-blue-700">
                        Enter the App
                    </button>
                </Link>
            </div>
            <div className="absolute w-12 h-24 bottom-[25vh] right-[8%]" onClick={() => scrollTo('#about')}>
                <div className="landing-arrow absolute scale-0 cursor-pointer bottom-0">
                    <svg className="w-12 h-12 stroke-neutral-950" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="4" x2="12" y2="20"></line>
                        <polyline points="6 14, 12 20, 18 14"/>
                    </svg>
                </div>
            </div>
                
        </div>
    )
}

export default Landing;