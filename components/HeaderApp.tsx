import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeaderApp = () => {

  return (
    <nav className='flex items-center justify-start space-x-8 bg-slate-50 container drop-shadow-xl min-h-16 min-w-full'>
      <Link href={"/"} className="items-center font-medium text-white text-lg hidden md:flex flex-row gap-2">
        <Image
          src={`/images/logo_light.png`}
          width={64}
          height={64}
          alt=""
          priority
          className="relative w-16 h-16 mr-auto md:mr-0 flex-shrink-0 !important"
        />
        <div className='text-xl font-bold text-black'>RWAWrapper</div>
      </Link>
      <ul className='flex items-start md:items-center space-x-5'>
        <li>
          <Link href="/mint" className='hover:text-black text-gray-400'>
            Mint
          </Link>
        </li>
        <li>
          <Link href="/wrapper" className='hover:text-black text-gray-400'>
            Wrapper
          </Link>
        </li>
      </ul>
      <div className='justify-center items-center min-w-[57%] max-w-2xl w-full hidden md:block'>
        {/* <Search /> */}
      </div>
      
    </nav>
  );
};
export default HeaderApp;