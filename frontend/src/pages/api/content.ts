import type { NextApiRequest, NextApiResponse } from 'next';
import { ThetaContentDeliveryClient } from 'theta-content-delivery-sdk'; // Hypothetical SDK

const contentClient = new ThetaContentDeliveryClient();

export default async function contentHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { contentId } = req.body;
    try {
      const content = await contentClient.getContent(contentId);
      res.status(200).json(content);
    } catch (error) {
      res.status(500).json({ error: 'Content retrieval failed', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
