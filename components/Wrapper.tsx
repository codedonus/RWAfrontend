'use client';

import { useState } from "react";
import Button from "./Button";
import { Radio, Input } from "antd";
import NFTModal from "./NFTModal";

const Wrapper: React.FC = () => {
  const [action, setAction] = useState<'Wrap' | 'Unwrap'>('Wrap');
  const [sellerAddress, setSellerAddress] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [approved, setApproved] = useState<boolean>(false);
  const [sufficient, setSufficient] = useState<boolean>(false);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-20 px-4 lg:px-4">
        <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto border rounded-lg p-4 bg-white drop-shadow-2xl">
          <h1 className="text-2xl font-semibold text-center pt-8">{`${action} NFT`}</h1>
          <div className="relative overflow-hidden flex flex-col items-center justify-center gap-18 p-4 w-full">
            <img src="/images/logo_dark.png" alt="" className="w-[80%] h-[80%] object-contain md:w-[300px] lg:w-[300px]" />
          </div>
          <div className="relative overflow-hidden flex flex-col items-center justify-center gap-18 p-4 w-full">
            <Radio.Group defaultValue="Wrap" buttonStyle="solid">
              <Radio.Button value="Wrap" onChange={() => setAction('Wrap')}>Wrap</Radio.Button>
              <Radio.Button value="Unwrap" onChange={() => setAction('Unwrap')}>Unwrap</Radio.Button>
            </Radio.Group>
          </div>
          {action === "Wrap" && 
          <NFTModal />
          }
          <div className="w-full space-x-5 flex items-center justify-center">
            {
              action === 'Wrap' && !approved ? 
              <Button>
                Approve
              </Button>
              :
              action === 'Unwrap' && sufficient ? <Button>
                {action}
              </Button> : 
              <div className="pb-4 flex flex-row">{"You don\'t have enough balance, get some "}&nbsp;<a href="/dex" className="text-blue-500"> here</a>.</div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wrapper;