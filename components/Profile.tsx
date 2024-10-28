'use client';

import { useState } from "react";
import AssetsCards from "./AssetsCards";
import Image from "next/image";
import { useAccount } from "@starknet-react/core";
import { Card } from "antd";

const Profile: React.FC = () => {
  const { address } = useAccount();

  return (
    // 添加 flex-grow 和 min-h-0 来确保内容可以正确扩展
    <div className="flex-grow min-h-0">
      <div className="relative bg-local bg-clip-border bg-transparent bg-gradient-to-br from-gray-300 to-gray-300/25 bg-origin-padding bg-top">
        <Image
          src={"/images/default_cover.png"}
          alt="cover"
          width={1706}
          height={133}
          className='relative bg-cover w-full h-auto lg:h-[400px]'
        />
        {/* 移除固定高度 h-[250px]，改用自适应高度 */}
        <div className='relative'>
          <Image
            src={"/images/default_avatar.png"}
            alt="avatar"
            width={200}
            height={200}
            className='absolute -top-[75px] left-4 rounded-full overflow-auto lg:w-[200px] lg:h-[200px] w-[150px] h-[150px]'
          />
          <div className='pt-[100px] lg:pt-[150px]'> {/* 调整头像下方内容的padding */}
            <div className='flex justify-between'>
              <div>
                <p className='text-2xl font-bold px-8'>
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'User'}
                </p>
                <p className='text-sm text-gray-500 px-8 pb-4 pt-3'>
                  {"Total RWA NFTs of this user."}
                </p>
              </div>
            </div>
            <div className='bg-gradient-to-b mx-2 text-left lg:mx-8'>
              <Card className='flex justify-center lg:justify-start bg-transparent'>
                <AssetsCards />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;
