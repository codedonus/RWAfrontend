import { supabase } from '@/lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';
import { Account, constants, ec, RpcProvider, typedData, Contract, uint256, encode } from 'starknet';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, url } = req;

  switch (method) {
    case "POST":
      // console.log(`req.body`, req.body);
      try {
        const { token_ids } = JSON.parse(req.body); // 解析查询参数

        if (!token_ids) {
          res.status(400).json({ ok: false, error: 'Missing token_ids' });
        }

        // console.log(`nft_contract_address`, BigInt(nft_contract_address).toString());

        const {data: nft_token_ids, error} = await supabase
          .from('nft_pool')
          .select('token_ids')
          .eq('nft_contract_address', BigInt(process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RWA_ADDRESS || '').toString());

        // console.log(`nft_token_ids`, nft_token_ids);

        if (error) {
          res.status(500).json({ ok: false, error: error.message });
        }

        if (!nft_token_ids || nft_token_ids.length === 0 || !nft_token_ids[0].token_ids) {
          res.status(404).json({ ok: false, error: 'No token IDs found for the given NFT contract address' });
          return;
        }
        // Merge the existing token IDs with the new ones
        const existingTokenIds = nft_token_ids[0].token_ids as number[];
        const newTokenIds = token_ids as number[];
        const mergedTokenIds = Array.from(new Set([...existingTokenIds, ...newTokenIds]));

        // Update the database with the merged token IDs
        const { data: updateResult, error: updateError } = await supabase
          .from('nft_pool')
          .update({ token_ids: mergedTokenIds })
          .eq('nft_contract_address', BigInt(process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RWA_ADDRESS || '').toString());

        if (updateError) {
          res.status(500).json({ ok: false, error: updateError.message });
          return;
        }

        res.status(200).json({ ok: true, message: 'Token IDs updated successfully', updatedTokenIds: mergedTokenIds });
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(400).json({ ok: false, error: error.message });
        } else {
          res.status(400).json({ ok: false, error: 'An unknown error occurred' });
        }
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;