'use client';

import { AssetProps, RWAType } from "@/types";
import Button from "./Button";
import { Image, Modal } from "antd";
import { useAbi } from "@/hooks/useAbi";
import { useContract } from "@starknet-react/core";
import { useEffect, useState, useMemo } from "react";
import { useNFTMetadata } from "@/hooks/useNFTMetadata";
import { formatBigNumber } from "@/utils/format";
import { formatAddress, formatMetadataValue } from "@/utils/format";
import { CairoCustomEnum } from "starknet";

const Asset: React.FC<AssetProps> = ({ tokenId }) => {
  const [NFTMetadata, setNFTMetadata] = useState<RWAType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 使用 useMemo 记忆化 tokenIds 数组
  const tokenIds = useMemo(() => [Number(tokenId)], [tokenId]);
  
  const { nftMetadataList, isLoading, error } = useNFTMetadata(tokenIds);

  useEffect(() => {
    if (nftMetadataList.length > 0) {
      setNFTMetadata(nftMetadataList[0].metadata);
    }
  }, [nftMetadataList])

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const renderMetadataSection = (data: Record<string, unknown>, level: number = 0): JSX.Element[] => {
    return Object.entries(data).flatMap(([key, value]) => {
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      
      if (value === null || value === undefined) return [];

      // 根据层级设置不同的字号
      const titleClassName = level === 0 ? "text-xl font-bold" : 
                           level === 1 ? "text-lg font-semibold" : 
                           "text-base font-medium";
      
      // 特殊处理 image 字段
      if (key === 'image') {
        return (
          <div key={key} style={{ marginLeft: `${level * 20}px` }} className="my-2">
            <span className={titleClassName}>{formattedKey} Hash: </span>
            <span className="font-normal">{value as React.ReactNode}</span>
          </div>
        );
      }

      // 特殊处理 CairoCustomEnum (asset_type)
      if (key === 'asset_type' && value instanceof CairoCustomEnum) {
        return (
          <div key={key} style={{ marginLeft: `${level * 20}px` }} className="my-2">
            <span className={titleClassName}>{formattedKey}: </span>
            <span className="font-normal">{value.activeVariant()}</span>
          </div>
        );
      }

      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        return (
          <div key={key} style={{ marginLeft: `${level * 20}px` }}>
            <div className={`${titleClassName} mt-4`}>{formattedKey}:</div>
            {renderMetadataSection(value as Record<string, unknown>, level + 1)}
          </div>
        );
      }

      const formattedValue = key === 'recipient' ? formatAddress(value) : formatMetadataValue(value);
      
      return (
        <div key={key} style={{ marginLeft: `${level * 20}px` }} className="my-2">
          <span className={titleClassName}>{formattedKey}: </span>
          <span className="font-normal">{formattedValue}</span>
        </div>
      );
    });
  };

  return (
    <div className="lg:mx-[204px] md:mx-8 my-0 gap-[20px] max-w-[1280px] px-10 pt-[40px] pb-[60px] gap-y-5 flex-col flex">
      <div className="grid grid-rows-1 lg:grid-cols-[320px,1fr] container gap-10 relative antialiased justify-center">
        <div className="aspect-square bg-white bg-clip-border bg-opacity-100 bg-origin-padding bg-no-repeat bg-auto rounded-xl box-border text-black block overflow-hidden relative antialiased h-[320px]">
          <Image alt="NFT Image" src={`https://tomato-tired-rattlesnake-260.mypinata.cloud/ipfs/${NFTMetadata?.image}`} width={320} height={320}/>
        </div>
        <div className="box-border text-black gap-5 gap-y-5 display-flex flex-col h-[180px] m-0 w-full antialiased">
          <div className="flex flex-col justify-center lg:justify-start items-center lg:items-start gap-1">
            <p className="box-border text-black block font-sans font-extrabold text-3xl md:justify-center h-10 antialiased">
              Asset Name: {NFTMetadata?.name}
            </p>
            <div className="group relative">
              <p className="text-gray-500 text-sm w-full truncate max-w-[600px]">
                {NFTMetadata?.description}
              </p>
              <div className="invisible group-hover:visible absolute z-10 bg-white p-2 rounded-lg shadow-lg max-w-[600px] break-words">
                {NFTMetadata?.description}
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 lg:w-auto w-full gap-4 font-mono text-black text-sm text-center font-bold leading-6 rounded-lg pt-10 container">
            <div className="p-4 rounded-lg shadow-lg bg-white drop-shadow-2xl">
              Type: {NFTMetadata?.asset_type?.activeVariant()}
            </div>
            <div className="p-4 rounded-lg shadow-lg bg-white drop-shadow-2xl">
              Valuation：{Number(NFTMetadata?.asset_details?.valuation?.amount)} {NFTMetadata?.asset_details?.valuation?.currency}
            </div>
            <div className="p-4 rounded-lg shadow-lg bg-white drop-shadow-2xl">
              Issuer: {NFTMetadata?.issuer?.name}
            </div>
            <div className="p-4 rounded-lg shadow-lg bg-white drop-shadow-2xl">
              Contact: {NFTMetadata?.issuer?.contact}
            </div>
            <div className="p-4 rounded-lg shadow-lg bg-white drop-shadow-2xl">
              Legal Status: {NFTMetadata?.asset_details?.legal_status}
            </div>
            <div className="p-4 rounded-lg shadow-lg bg-white drop-shadow-2xl">
              Issuance Date: {NFTMetadata?.asset_details?.issued_date}
            </div>
          </div>
        </div>
      </div>
      <div className="border border-none rounded-xl box-border text-black block font-sans w-full mt-10 antialiased pt-[300px] lg:pt-0">
        <div className="grid grid-cols-1 gap-x-20 gap-y-10 font-mono text-white text-sm text-center justify-center items-center font-bold leading-6 bg-stripes-fuchsia rounded-lg p-4">
          <div className="flex flex-col justify-center items-center"> 
            <Button onClick={showModal}>
              Check all metadata
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title="NFT Metadata"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <div className="max-h-[600px] overflow-y-auto p-4">
          {NFTMetadata && renderMetadataSection(NFTMetadata)}
        </div>
      </Modal>
    </div>
  )
}

export default Asset;
