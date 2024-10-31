import { GithubFilled } from "@ant-design/icons";
import Link from "next/link";

const FooterApp = () => {
  return (
    <div className="bg-black mt-auto">
      <div className="text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-row justify-between gap-10">
            <div className="flex flex-col gap-6">
              <div className="text-xl font-bold">
                <Link href="/" passHref className="hover:text-white">
                  RWAWrapper
                </Link>
              </div>
              <div className="text-sm">
                RWAWrapper is a Real World Assets Wrapper on Starknet, 
                <br /> which allows you to wrap your Real World Assets (RWA) 
                <br /> into NFTs.
              </div>
            </div>
            <div className="flex flex-col gap-6 text-xs">
              <div className="text-xl font-semibold">Relative Links</div>
              <div className="flex gap-4">
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                    <GithubFilled />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10"></div>
          <div className="flex justify-between items-center gap-10 mt-10 text-xs">
            <div>© {new Date().getFullYear()} RWAWrapper. All rights reserved.</div>
            <div className="flex gap-4 text-xs">
              
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Source Code
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterApp;