// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { configureSongFileContents } from '@/services/songFileConfigureService';
import { getSongFileContents, saveSongFileContents } from '@/services/songFileService';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const identifier = req.query.identifier;
    if (!identifier || Array.isArray(identifier)) {
        res.status(400);
        return;
    }

    const fileContents = await getSongFileContents(identifier);
    let newFileContents
    try {
        newFileContents = configureSongFileContents(fileContents.songContents);
    } catch (error) {
        res.status(400).json(error as string);
        return;
    }

    await saveSongFileContents(identifier, fileContents.metadataContents, newFileContents);

    res.status(200).json('success');
}
