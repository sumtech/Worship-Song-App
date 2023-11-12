import path from "path";
import { promises as fs } from 'fs';

export type SongFileData = {
    identifier: string;
    metadataContents: string;
    songContents: string;
}

/**
 * Gets the contents for the song files.
 * @returns The list of contents for the song files.
 */
export const getSongListFileContents = async (): Promise<SongFileData[]> => {
    const fileDirectory = path.join(process.cwd(), 'song-files');
    const files = (await fs.readdir(fileDirectory, { encoding: 'utf-8' })).filter(file => path.extname(file) === '.txt');

    return Promise.all(files.map(async file => {
        const filePath = `${fileDirectory}/${file}`;
        const identifier = file.slice(0, file.length - 4);
        const fileContents = await fs.readFile(filePath, { encoding: 'utf-8' });

        const fileContentParts = fileContents.split(/={5,}/ig);
        if (fileContentParts.length !== 2) {
            return {
                identifier,
                metadataContents: "",
                songContents: ""
            }
        }

        return {
            identifier,
            metadataContents: fileContentParts[0],
            songContents: ""
        };
    }));
}

/**
 * Gets the raw contents of a song file.
 * @param identifier The identifier for the song, based on how the file is named. i.e., "worthy-of-it-all"
 * @returns The raw contents of the song file.
 */
export const getSongFileContents = async (identifier: string): Promise<SongFileData> => {
    const fileDirectory = path.join(process.cwd(), 'song-files');
    const filePath = `${fileDirectory}/${identifier}.txt`;
    const fileContents = await fs.readFile(filePath, { encoding: 'utf-8' });

    const fileContentParts = fileContents.split(/={5,}/ig);
    if (fileContentParts.length !== 2) {
        return {
            identifier,
            metadataContents: "",
            songContents: "",
        };
    }

    return {
        identifier,
        metadataContents: fileContentParts[0],
        songContents: fileContentParts[1],
    };
}

/**
 * Saves the new file contents over the old file contents for the song.
 * @param identifier The identifier for the song, based on how the file is named. i.e., "worthy-of-it-all"
 * @param newFileContents The new raw contents of the song file.
 */
export const saveSongFileContents = async (identifier: string, metadataContents: string, newFileContents: string): Promise<void> => {
    const fileDirectory = path.join(process.cwd(), 'song-files');
    const filePath = `${fileDirectory}/${identifier}.txt`;
    await fs.writeFile(filePath, `${metadataContents}==========\r\n${newFileContents}`, { encoding: 'utf-8' });
}