import { supabase } from '@/lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';
import { Account, constants, ec, RpcProvider, typedData, Contract, uint256, encode } from 'starknet';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, url } = req;

  switch (method) {
    case "POST":
      console.log(`req.body`, req.body);
      const { user_address, nft_contract_address } = req.body; // 解析查询参数

      if (!user_address || !nft_contract_address) {
        return res.status(400).json({ error: 'Missing user_address or nft_contract_address' });
      }
      const token_id = 1;
      const typedDataValidate = {
        types: {
          StarkNetDomain: [
            { name: 'name', type: 'felt' },
            { name: 'version', type: 'felt' },
            { name: 'chainId', type: 'felt' },
          ],
          Unwrap: [
            { name: 'user_address', type: 'felt' },
            { name: 'nft_contract_address', type: 'felt' },
            { name: 'token_id', type: 'u256' },
          ],
          u256: [
            { name: 'low', type: 'felt' },
            { name: 'high', type: 'felt' },
          ]
        },
        primaryType: 'Unwrap',
        domain: {
          name: 'NFTWrapper', // put the name of your dapp to ensure that the signatures will not be used by other DAPP
          version: '1',
          chainId: constants.StarknetChainId.SN_SEPOLIA,
        },
        message: {
          user_address,
          nft_contract_address,
          token_id: uint256.bnToUint256(token_id),
        },
      };
      const provider = new RpcProvider({ nodeUrl: process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RPC });
      if (!process.env.NEXT_PUBLIC_STARKNET_SIGNER_ADDRESS || !process.env.NEXT_PUBLIC_STARKNET_SIGNER_PRIVATE_KEY) {
        throw new Error('Environment variables ADDRESS and PRIVATE_KEY must be defined');
      }
      const account = new Account(provider, process.env.NEXT_PUBLIC_STARKNET_SIGNER_ADDRESS, process.env.NEXT_PUBLIC_STARKNET_SIGNER_PRIVATE_KEY);
      const signature = (await account.signMessage(typedDataValidate));
      console.log('Signature:', signature);

      // 使用自定义 replacer 函数来处理 BigInt
      const jsonString = JSON.stringify(signature, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );
      
      res.status(200).json({ ok: true, signature: JSON.parse(jsonString) });
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;