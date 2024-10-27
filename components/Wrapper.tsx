'use client';

import { useEffect, useState } from "react";
import Button from "./Button";
import { Radio, Input, message } from "antd";
import NFTModal from "./NFTModal";
import { useAccount, useContract, useReadContract, useSendTransaction } from "@starknet-react/core";
import { Abi } from "starknet";
import { useAbi } from "@/hooks/useAbi";

const Wrapper: React.FC = () => {
  const [action, setAction] = useState<'Wrap' | 'Unwrap'>('Wrap');
  const [sellerAddress, setSellerAddress] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [approved, setApproved] = useState<boolean>(false);
  const [sufficient, setSufficient] = useState<boolean>(false);
  const [selectedNFTs, setSelectedNFTs] = useState<number[]>([]);
  const [sendFn, setSendFn] = useState<() => void>(() => {});
  const [wrappedNFTs, setWrappedNFTs] = useState<number[]>([]);

  const { address } = useAccount();

  // check if the NFT is approved for the wrapper
  const { abi: abiOfRWA, error: abiNFTError } = useAbi(process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RWA_ADDRESS as `0x${string}`);

  const {contract: rwaContract } = useContract({
    address: process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RWA_ADDRESS as `0x${string}`,
    abi: abiOfRWA as Abi,
  });

  const { data: isApproved, error: checkApprovedError } = useReadContract({
    address: process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RWA_ADDRESS as `0x${string}`,
    abi: abiOfRWA as Abi,
    functionName: "isApprovedForAll",
    args: [address, process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_WRAPPER_ADDRESS as `0x${string}`],
    watch: true
  })

  // approve NFT for the wrapper
  const { send: approveSend, error: approveError, isPending: approveIsPending, isSuccess: approveIsSuccess } = useSendTransaction({ 
    calls: 
      rwaContract && address && abiOfRWA
        ? [rwaContract.populate("setApprovalForAll", [process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_WRAPPER_ADDRESS as `0x${string}`, true])] 
        : undefined, 
  });

  // wrap NFT
  const { abi: abiOfWrapper, error: abiWrapperError } = useAbi(process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_WRAPPER_ADDRESS as `0x${string}`);
  const {contract: wrapperContract } = useContract({
    address: process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_WRAPPER_ADDRESS as `0x${string}`,
    abi: abiOfWrapper as Abi,
  });

  const { send: wrapSend, error: wrapError, isPending: wrapIsPending, isSuccess: wrapIsSuccess } = useSendTransaction({ 
    calls: 
      wrapperContract && address && abiOfWrapper
        ? selectedNFTs.map(tokenId => 
            wrapperContract.populate("wrap", [process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RWA_ADDRESS as `0x${string}`, tokenId])
          )
        : undefined, 
  }); 

  const { send: unwrapSend, error: unwrapError, isPending: unwrapIsPending, isSuccess: unwrapIsSuccess } = useSendTransaction({ 
    calls: 
      wrapperContract && address 
        ? selectedNFTs.map(tokenId => 
            wrapperContract.populate("unwrap", [tokenId, price, sellerAddress])
          )
        : undefined, 
  });

  const handleSelectNFTs = (tokenIds: number[]) => {
    console.log('Selected NFT token IDs:', tokenIds);
    // 在这里处理选中的 NFT
    setSelectedNFTs(tokenIds);
  };

  useEffect(() => {
    if (abiNFTError || abiWrapperError) {
      console.error('Failed to fetch ABI:', abiNFTError || abiWrapperError);
    }
    console.log('contract: ', rwaContract);
  }, [abiNFTError, abiWrapperError, rwaContract]);

  useEffect(() => {
    if (isApproved) {
      setApproved(true);
    }
  }, [isApproved]);

  useEffect(() => {
    if (approveIsSuccess) {
      setApproved(true);
    }
  }, [approveIsSuccess]);

  useEffect(() => {
    if (wrapIsSuccess) {
      message.success(`NFTs wrapped successfully`);
      fetch(`/api/remove_nft_from_profile`, {
        method: 'POST',
        body: JSON.stringify({ user_address: address, token_ids: selectedNFTs })
      });
      fetch(`/api/wrap`, {
        method: 'POST',
        body: JSON.stringify({ token_ids: selectedNFTs })
      });
      setWrappedNFTs(prev => [...prev, ...selectedNFTs]);
      setSelectedNFTs([]);
    }
  }, [wrapIsSuccess, address, selectedNFTs]);

  // set the function to send
  useEffect(() => {
    if (action === 'Wrap') {
      setSendFn(() => wrapSend);
    } else {
      setSendFn(() => unwrapSend);
    }
  }, [action]);

  useEffect(() => {
    if (rwaContract && address && abiOfRWA) {
      // 所有必要的数据都已加载，可以进行其他初始化操作
    }
  }, [rwaContract, address, abiOfRWA]);

  return (
    <div>
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
            <NFTModal onSelectNFTs={handleSelectNFTs} wrappedNFTs={wrappedNFTs} />
          }
          <div className="w-full space-x-5 flex items-center justify-center">
            {
              action === 'Wrap' ? (
                !approved ? (
                  <Button onClick={() => approveSend()}>
                    Approve
                  </Button>
                ) : (
                  <Button onClick={() => wrapSend()}>
                    {wrapIsPending ? 'Wrapping...' : wrapIsSuccess ? 'Wrapped' : 'Wrap'}
                  </Button>
                )
              ) : action === 'Unwrap' && sufficient ? (
                <Button onClick={sendFn}>
                  {unwrapIsPending ? 'Unwrapping...' : unwrapIsSuccess ? 'Unwrapped' : 'Unwrap'}
                </Button>
              ) : (
                <div className="pb-4 flex flex-row">{"You don't have enough balance, get some from dex."}</div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wrapper;
