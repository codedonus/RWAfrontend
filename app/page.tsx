'use client'

import React, { useRef } from "react";
import Link from "next/link";

import { ScrollSmoother } from "@/components/gsap";
import useLayoutEffect from "@/components/use-isomorpphic-layout-effect";

import Landing from "@/components/Landing";
import About from "@/components/About";
import HomeLoader from "@/components/HomeLoader";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import NavBar from "@/components/Navbar";

const App = () => {

  const smoother = useRef<ScrollSmoother | null>(null);

  useLayoutEffect(() => {
    smoother.current = ScrollSmoother.create({
      smooth: 1,
      effects: true,
      ignoreMobileResize: true,
    }).paused(true);

    setTimeout(() => {
      scrollPaused(false);
    }, 2900);
  }, []);

  const scrollPaused = (state: boolean) => {
    smoother.current?.paused(state);
  };

  const scrollToSection = (id: string) => {
    smoother.current?.scrollTo(id, true, "top 200px");
  };

  return (
    <div>
      <main id="smooth-wrapper">
        <div id="smooth-content" className="will-change-transform">
          <Landing scrollTo={scrollToSection}/>
          <About />
          <Features />
          <Footer />
        </div>
        <NavBar scrollTo={scrollToSection} scrollPaused={scrollPaused}/>
        <HomeLoader />
      </main>
    </div>
  )
}

export default App;