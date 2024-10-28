import { supabase } from '@/lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, url } = req;

  switch (method) {
    case "POST":
      try {
        const { user_address: userAddress, token_id: tokenId } = req.body;

        if (!userAddress || !tokenId) {
          res.status(400).json({ ok: false, error: 'Missing user_address or token_id' });
        }
        
        const { data: nfts, error } = await supabase
          .from('user_nfts')
          .select('token_ids')
          .eq('user_address', BigInt(userAddress));
        
        let updatedTokenIds: number[] = [];

        if (Object.keys(nfts as object).length === 0) {
          const { data: newData, error } = await supabase
            .from('user_nfts')
            .insert({
              user_address: BigInt(userAddress).toString(),
              token_ids: [tokenId]
            })
            .select();
            // console.log(newData, error)
            res.status(200).json({ ok: true, error: error, data: newData?.[0].token_ids });
        }
        else {
          if (nfts && nfts.length > 0) {
            // Create a new Set to remove duplicates, then convert back to array
            updatedTokenIds = Array.from(new Set([...nfts[0].token_ids, tokenId]));
            
            const { data: updateData, error } = await supabase
              .from('user_nfts')
              .update({ token_ids: updatedTokenIds })
              .eq('user_address', BigInt(userAddress).toString());
            
            if (error) {
              res.status(500).json({ ok: false, error: error.message });
              return;
            }
          } else {
            res.status(500).json({ ok: false, error: 'No NFTs found for the user' });
            return;
          }
        }

        if (error) {
          res.status(500).json({ ok: false, error: error.message });
        }
        res.status(200).json({ ok: true, data: updatedTokenIds });
      } catch (error: unknown) {
        if (error instanceof Error) {
          // 500: Internal Server Error - Caught error with message
          res.status(500).json({ ok: false, error: error.message });
        } else {
          // 500: Internal Server Error - Unknown error
          res.status(500).json({ ok: false, error: 'An unknown error occurred' });
        }
      }
      break;

    default:
      // 405: Method Not Allowed - Invalid HTTP method
      res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  
};

export default handler;