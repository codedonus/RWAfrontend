'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { Modal, Card, Spin, message, Tag } from "antd";
import Button from "./Button";
import { useAccount } from "@starknet-react/core";
import { useNFTMetadata } from '@/hooks/useNFTMetadata';
import Image from "next/image";

const NFTModal: React.FC<{ onSelectNFTs: (tokenIds: number[]) => void, wrappedNFTs: number[] }> = ({ onSelectNFTs, wrappedNFTs }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nftIds, setNftIds] = useState<number[]>([]);
  const [selectedTokenIds, setSelectedTokenIds] = useState<number[]>([]);
  const prevWrappedNFTs = useRef<number[]>([]);

  const { address } = useAccount();

  const showModal = useCallback(() => setIsModalOpen(true), []);
  const handleCancel = useCallback(() => setIsModalOpen(false), []);

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

  useEffect(() => {
    if (wrappedNFTs.length > prevWrappedNFTs.current.length) {
      // Remove wrapped NFTs from the displayed list
      setNftIds(prevIds => prevIds.filter(id => !wrappedNFTs.includes(id)));
      // Clear selection
      setSelectedTokenIds([]);
    }
    prevWrappedNFTs.current = wrappedNFTs;
  }, [wrappedNFTs]);

  const handleOk = useCallback(() => {
    if (selectedTokenIds.length === 0) {
      message.warning('Please select at least one NFT');
      return;
    }
    onSelectNFTs(selectedTokenIds);
    setIsModalOpen(false);
  }, [selectedTokenIds, onSelectNFTs]);

  const toggleNFTSelection = useCallback((tokenId: number) => {
    setSelectedTokenIds(prev => 
      prev.includes(tokenId) 
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    );
  }, []);

  return (
    <div>
      <Button onClick={showModal}>
        Choose NFT
      </Button>
      {selectedTokenIds.length > 0 && (
        <div className="mt-2 mb-2">
          <p>Selected NFTs:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTokenIds.map((tokenId) => (
              <Tag key={tokenId} color="blue" closable onClose={() => toggleNFTSelection(tokenId)}>
                Token ID: {tokenId}
              </Tag>
            ))}
          </div>
        </div>
      )}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        width={850}
        title="Choose your NFT"
        className="max-h-[600px] overflow-y-auto"
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {nftMetadataList.map((nft) => (
              <Card
                key={nft.token_id}
                hoverable
                style={{ 
                  width: 240,
                  border: selectedTokenIds.includes(nft.token_id) ? '2px solid #1890ff' : undefined
                }}
                onClick={() => toggleNFTSelection(nft.token_id)}
                cover={
                  <Image
                    alt={nft.metadata.name}
                    src={`https://tomato-tired-rattlesnake-260.mypinata.cloud/ipfs/${nft.metadata.image}`}
                    width={240}
                    height={240}
                    layout="responsive"
                  />
                }
              >
                <Card.Meta
                  title={nft.metadata.name}
                  description={`Token ID: ${nft.token_id}`}
                />
              </Card>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NFTModal;
