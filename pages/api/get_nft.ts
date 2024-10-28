import { supabase } from '@/lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, url } = req;

  switch (method) {
    case "GET":
      try {
        const { user_address: userAddress } = req.query;

        if (!userAddress) {
          res.status(400).json({ ok: false, error: 'Missing user_address' });
        }

        let userAddressBigInt: bigint = BigInt(0);
        try {
          userAddressBigInt = BigInt(userAddress as string);
        } catch (error) {
          res.status(400).json({ ok: false, error: 'Invalid user_address' });
        }
        
        const { data: nfts, error } = await supabase
          .from('user_nfts')
          .select('token_ids')
          .eq('user_address', userAddressBigInt);
        
        if (error) {
          res.status(500).json({ ok: false, error: error.message });
        }
        res.status(200).json({ ok: true, data: nfts?.[0].token_ids });
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