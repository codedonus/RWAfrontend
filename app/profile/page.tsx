'use client';

import FooterApp from "@/components/FooterApp";
import HeaderApp from "@/components/HeaderApp";
import Profile from "@/components/Profile";

const ProfilePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderApp />
      <Profile />
      <FooterApp />
    </div>
  )
}

export default ProfilePage;