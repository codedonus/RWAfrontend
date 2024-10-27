import { supabase } from '@/lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';
import { Account, constants, ec, RpcProvider, typedData, Contract, uint256, encode } from 'starknet';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, url } = req;

  switch (method) {
    case "POST":
      try {
        const { user_address: userAddress, token_ids } = JSON.parse(req.body);

        if (!userAddress || !token_ids) {
          console.log('userAddress: ', userAddress);
          console.log('token_ids: ', token_ids);
          res.status(400).json({ ok: false, error: 'Missing user_address or token_ids' });
        }
        const { data: nfts, error } = await supabase
        .from('user_nfts')
        .select('token_ids')
        .eq('user_address', BigInt(userAddress));
        if (error) {
          res.status(500).json({ ok: false, error: error.message });
        }
        // Remove the token_id from the nfts array
        const updatedTokenIds = nfts?.[0].token_ids?.filter(id => !token_ids.includes(id)) || [];

        // Update the database with the new array
        const { data: updateResult, error: updateError } = await supabase
          .from('user_nfts')
          .update({ token_ids: updatedTokenIds })
          .eq('user_address', BigInt(userAddress));

        if (updateError) {
          res.status(500).json({ ok: false, error: updateError.message });
          return;
        }
        
        res.status(200).json({ ok: true, message: `Token ID #${JSON.stringify(token_ids)} removed successfully` });

      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(500).json({ ok: false, error: error.message });
        } else {
          res.status(500).json({ ok: false, error: 'An unknown error occurred' });
        }
      }
      break;

    default:
      res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
};

export default handler;
