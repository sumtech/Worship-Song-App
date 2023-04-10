import path from "path";
import { promises as fs } from 'fs';

export type SongSummary = {
    title: string,
    author: string,
    identifier: string,
    metadata: { [key: string]: string },
}

export type SongData = {
    metadata: { [key: string]: string },
    sections: {
        title: string,
        content: string[],
        styledContent: string[];
    }[],
}

const endHeaderMarker = '==========';

export const getSongList = async (): Promise<SongSummary[]> => {
    const fileDirectory = path.join(process.cwd(), 'song-files');
    const files = await fs.readdir(fileDirectory, { encoding: 'utf-8' });

    return Promise.all(files.map(async file => {
        const filePath = `${fileDirectory}/${file}`;
        const identifier = file.slice(0, file.length - 4);
        const fileContents = await fs.readFile(filePath, { encoding: 'utf-8' });
        const songData = getSongDataFromFileContents(fileContents, { metadataOnly: true });
        const songSummary: SongSummary = {
            title: songData.metadata.title,
            author: songData.metadata.authors || songData.metadata.author,
            identifier,
            metadata: songData.metadata,
        };
        return songSummary;
    }));

}

export const getFileContents = async (identifier: string): Promise<string> => {
    const fileDirectory = path.join(process.cwd(), 'song-files');
    const filePath = `${fileDirectory}/${identifier}.txt`;
    return await fs.readFile(filePath, { encoding: 'utf-8' });
}

export const getSongDataFromFileContents = (fileContents: string, options?: { chordStyle?: string, metadataOnly?: boolean }): SongData => {
    const contentLines = fileContents.replaceAll('\r\n', '\n').split('\n');

    let isPastHeader = fileContents.indexOf(endHeaderMarker) === -1;
    let songData: SongData = {
        metadata: {},
        sections: [],
    }
    contentLines.forEach((line) => {
        if (!isPastHeader) {
            // Collect metadata
            if (line.indexOf(endHeaderMarker) !== -1) {
                isPastHeader = true;
                return;
            }

            if (line.indexOf(':') === -1) {
                return;
            }

            const [name, value] = line.split(':').map(chunk => chunk.trim());
            songData.metadata[name.toLowerCase()] = value;
        } else {
            // Build content
            if (options?.metadataOnly) {
                return;
            }

            const trimmedContent = line.trim();
            if (!trimmedContent) {
                return;
            }

            if (trimmedContent[0] === '[') {
                songData.sections.push({
                    title: trimmedContent.slice(1, trimmedContent.length - 1),
                    content: [],
                    styledContent: [],
                });
                return;
            }

            if (!songData.sections.length) {
                songData.sections.push({
                    title: '',
                    content: [],
                    styledContent: [],
                });
            }

            songData.sections.slice(-1)[0].content.push(line);
            const styledLine = line.replaceAll(/\{(.*?)\}/ig, `<span class="${options?.chordStyle}">$1</span>`)
            songData.sections.slice(-1)[0].styledContent.push(styledLine);
        }
    });

    return songData;
}