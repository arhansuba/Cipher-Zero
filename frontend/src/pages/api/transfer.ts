import type { NextApiRequest, NextApiResponse } from 'next';
import { ThetaClient } from 'theta-client-sdk'; // Hypothetical SDK

const thetaClient = new ThetaClient();

export default async function transfer(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { toAddress, amount } = req.body;
    try {
      await thetaClient.sendTransaction({ to: toAddress, value: amount });
      res.status(200).json({ message: 'Transfer successful' });
    } catch (error) {
      res.status(500).json({ error: 'Transfer failed', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
