import formidable from 'formidable';
import fs from 'fs-extra';
import { NextApiRequest, NextApiResponse } from 'next';
import { ThetaStorageClient } from 'theta-storage-sdk'; // Hypothetical SDK

const storageClient = new ThetaStorageClient();

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing for file uploads
  },
};

export default async function upload(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.maxFileSize = 10 * 1024 * 1024; // Set max file size to 10 MB

    form.parse(req, async (err, _fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Upload failed', details: err.message });
        return;
      }

      const file = files.file[0];
      const filePath = file.filepath;

      try {
        // Upload file to Theta Storage
        const result = await storageClient.uploadFile(filePath);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: 'Storage upload failed', details: error.message });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
