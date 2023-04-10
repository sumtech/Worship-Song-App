import type { NextApiRequest, NextApiResponse } from 'next';
import { getFileContents, getSongDataFromFileContents } from '@/services/songs.service';
import type { SongData } from "@/services/songs.service"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SongData>
) {
  const { identifier } = req.query;
  if (!identifier) {
    res.status(404);
    return;
  }

  if (Array.isArray(identifier)) {
    res.status(404);
    return;
  }

  let fileContents: string;
  try {
    fileContents = await getFileContents(identifier);
  } catch {
    res.status(404);
    return;
  }

  const songData = getSongDataFromFileContents(fileContents);
  res.status(200).json(songData);
}
