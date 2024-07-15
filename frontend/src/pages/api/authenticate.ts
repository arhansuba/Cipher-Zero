import type { NextApiRequest, NextApiResponse } from 'next';
import { ThetaWallet } from 'theta-wallet-sdk'; // Hypothetical SDK

const thetaWallet = new ThetaWallet();

export default async function authenticate(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { address } = req.body;
      await thetaWallet.connect(address);
      res.status(200).json({ message: 'Authenticated successfully', address });
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
