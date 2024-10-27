import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import StarknetProvider from "./starknet-provider";
import ConnectButton from "@/components/ConnectButton";


export const metadata: Metadata = {
  title: "RWAWrapper",
  description: "RWAWrapper is a Real World Assets Wrapper on Starknet, which allows you to wrap your Real World Assets (RWA) into NFTs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StarknetProvider>
          <div className="flex justify-end pr-3 pt-2 absolute z-10 right-0">
            <ConnectButton />
          </div>
          {children}
        </StarknetProvider>
      </body>
    </html>
  );
}
