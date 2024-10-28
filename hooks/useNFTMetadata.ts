import { useEffect, useState } from 'react';
import { useContract, useProvider } from '@starknet-react/core';
import { Abi, Contract } from 'starknet';
import { useAbi } from './useAbi';
import { RWAType } from '@/types';

export function useNFTMetadata(tokenIds: number[]) {
  const [nftMetadataList, setNftMetadataList] = useState<Array<{ token_id: number, metadata: RWAType }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 使用 JSON.stringify 来比较数组内容而不是引用
  const tokenIdsKey = JSON.stringify(tokenIds);

  const provider = useProvider();
  const { abi } = useAbi(process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RWA_ADDRESS as `0x${string}`);

  const { contract } = useContract({
    address: process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RWA_ADDRESS as `0x${string}`,
    abi: abi as Abi,
  });

  console.log('tokenIds: ', tokenIds);

  useEffect(() => {
    const fetchNftMetadata = async () => {
      if (!contract || !tokenIds || tokenIds.length === 0) return;

      setIsLoading(true);
      setError(null);

      try {
        const metadataPromises = tokenIds.map(async (tokenId) => {
          const metadata = await contract.call('get_uri', [tokenId]);
          return { token_id: tokenId, metadata };
        });

        const results = await Promise.all(metadataPromises);
        setNftMetadataList(results);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching NFT metadata'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNftMetadata();
  }, [contract, tokenIdsKey]); // 使用 tokenIdsKey 替代 tokenIds

  return { nftMetadataList, isLoading, error };
}
