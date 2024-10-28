'use client';

import { useEffect, useState } from "react";
import { Card } from "antd";
import { useAccount } from "@starknet-react/core";
import { useNFTMetadata } from '@/hooks/useNFTMetadata';
import Image from "next/image";
import Link from "next/link";
import { Loading } from "./Loading";

const AssetsCards: React.FC = () => {
  const [nftIds, setNftIds] = useState<number[]>([]);
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      fetch(`/api/get_nft?user_address=${address}`)
        .then(response => response.json())
        .then(data => {
          setNftIds(data.data);
        })
        .catch(error => console.error('Error fetching NFT IDs:', error));
    }
  }, [address]);

  const { nftMetadataList, isLoading, error } = useNFTMetadata(nftIds);

  useEffect(() => {
    if (error) {
      console.error('Error fetching NFT metadata:', error);
    }
  }, [error]);

  return (
    <div className="min-h-[500px]">
      {isLoading ? (
        <div className="flex text-center p-5 items-center">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {nftMetadataList.map((nft) => (
            <Link href={`/asset/${nft.token_id}`} key={nft.token_id}>
              <Card
                hoverable
                style={{ width: 300 }}
                cover={
                  <Image
                    alt={nft.metadata.name}
                    src={`https://tomato-tired-rattlesnake-260.mypinata.cloud/ipfs/${nft.metadata.image}`}
                    width={300}
                    height={300}
                    layout="responsive"
                  />
                }
                className="bg-opacity-50"
              >
                <Card.Meta
                  title={nft.metadata.name}
                  description={`Token ID: ${nft.token_id}`}
                />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetsCards;

