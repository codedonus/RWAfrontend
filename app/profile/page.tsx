'use client';

import FooterApp from "@/components/FooterApp";
import HeaderApp from "@/components/HeaderApp";
import Profile from "@/components/Profile";
import { useAccount } from "@starknet-react/core";

const ProfilePage: React.FC = () => {

  const { address } = useAccount();
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderApp />
      <main className="flex-grow">
        {
          address ? 
          <Profile /> : 
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-2xl font-bold">Please connect your wallet</div>
          </div>
        }
      </main>
      <FooterApp />
    </div>
  )
}

export default ProfilePage;