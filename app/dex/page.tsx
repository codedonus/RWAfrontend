"use client";

import Dex from "@/components/Dex";
import FooterApp from "@/components/FooterApp";
import HeaderApp from "@/components/HeaderApp";

const DexPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderApp />
      <Dex />
      <FooterApp />
    </div>
  )
}

export default DexPage;