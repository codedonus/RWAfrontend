import { useState, useEffect } from 'react';
import { Abi, RpcProvider } from "starknet";

export const useAbi = (contractAddress: `0x${string}`) => {
  const [abi, setAbi] = useState<Abi | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getAbi = async () => {
      try {
        const provider = new RpcProvider({
          nodeUrl: process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RPC as string
        });
        const classAt = await provider.getClassAt(contractAddress);
        if (classAt === undefined || classAt.abi === undefined) throw new Error('Abi is undefined');
        setAbi(classAt.abi);
        console.log('ABI fetched successfully:', classAt.abi);
      } catch (err) {
        console.error('Error fetching ABI:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        return null;
      }
    };

    const fetchAbiWithRetry = async () => {
      while (true) {
        const result = await getAbi();
        if (result !== null) break;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
      }
    };

    fetchAbiWithRetry();
  }, [contractAddress]);

  return { abi, error };
};
