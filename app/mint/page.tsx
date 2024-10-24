"use client";

import FooterApp from "@/components/FooterApp";
import HeaderApp from "@/components/HeaderApp";
import Mint from "@/components/Mint";

const MintPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderApp />
      <Mint />
      <FooterApp />
    </div>
  );
}

export default MintPage;