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
        styledContent: string[],
        lyrics: string[],
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
            title: songData.metadata.title ?? '<<Title goes here>>',
            author: songData.metadata.authors || songData.metadata.author || '<<Author goes here>>',
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

const addMetadataToSongData = (line: string, songData: SongData) => {
    const [name, value] = line.split(':').map(chunk => chunk.trim());
    songData.metadata[name.toLowerCase()] = value;
}

const addContentToSongData = (line: string, songData: SongData, chordStyle: string | undefined) => {
    // Check for heading.
    if (line[0] === '[') {
        songData.sections.push({
            title: line.slice(1, line.length - 1),
            content: [],
            styledContent: [],
            lyrics: [],
        });
        return;
    }

    // Initialize first section if needed.
    if (!songData.sections.length) {
        songData.sections.push({
            title: '',
            content: [],
            styledContent: [],
            lyrics: [],
        });
    }

    // TODO: Remove spaces from inside chord markers.
    // line = line.replaceAll(/\{.*?(\s*).*?\}/ig, '')

    // Add spaces to force padding between chords when needed.
    let bufferNeeded: number | undefined = undefined;
    let bufferStillNeeded: number = 0;
    let lastSpaceLocation: number | undefined = 0;
    let placesToAddSpaces: { index: number, spaces: number }[] = [];
    for (let i = 0; i < line.length; i++) {
        // Check for beginning of a chord.
        if (line[i] === '{') {
            if (bufferStillNeeded) {
                placesToAddSpaces.push({
                    index: lastSpaceLocation !== undefined ? lastSpaceLocation + 1 : i,
                    spaces: bufferStillNeeded,
                });
                bufferStillNeeded = 0;
            }

            lastSpaceLocation = undefined;

            bufferNeeded = 1;
            continue;
        }

        // Check for end of a chord.
        if (line[i] === '}') {
            bufferStillNeeded = bufferNeeded as number;
            bufferNeeded = undefined;
            continue;
        }

        // Add to count when inside chord marker.
        if (bufferNeeded !== undefined) {
            bufferNeeded = bufferNeeded + 1;
            continue;
        }

        // Check for a space.
        if (line[i] === ' ') {
            lastSpaceLocation = i;
        }

        // Decrement the buffer still needed.
        if (bufferStillNeeded) {
            bufferStillNeeded = bufferStillNeeded - 1;
            continue;
        }
    }
    const spaceSeparator = ' ';
    placesToAddSpaces.reverse().forEach((place) => {
        for (let j: number = 0; j < place.spaces; j++) {
            line = `${line.slice(0, place.index)}${spaceSeparator}${line.slice(place.index)}`;
        }
    });

    // Add content to the song data.
    songData.sections.slice(-1)[0].content.push(line);
    const styledLine = line.replaceAll(/\{(.*?)\}/ig, `<span class="${chordStyle}">$1</span>`);
    songData.sections.slice(-1)[0].styledContent.push(styledLine);
    const lyrics = line.replaceAll(/\{(.*?)\}/ig, '')
    songData.sections.slice(-1)[0].lyrics.push(lyrics);
}

export const getSongDataFromFileContents = (fileContents: string, options?: { chordStyle?: string, metadataOnly?: boolean }): SongData => {
    const contentLines = fileContents.replaceAll('\r\n', '\n').split('\n');

    let isPastHeader = fileContents.indexOf(endHeaderMarker) === -1;
    let songData: SongData = {
        metadata: {},
        sections: [],
    }
    contentLines.forEach((line) => {
        if (!isPastHeader) { // Collect metadata.
            // Check for end marker.
            if (line.indexOf(endHeaderMarker) !== -1) {
                isPastHeader = true;
                return;
            }

            // Check for metadata.
            if (line.indexOf(':') === -1) {
                return;
            }

            addMetadataToSongData(line, songData);
        } else { // Build content.
            // Check whether we want 
            if (options?.metadataOnly) {
                return;
            }

            // Check for content.
            const trimmedContent = line.trim();
            if (!trimmedContent) {
                return;
            }

            addContentToSongData(trimmedContent, songData, options?.chordStyle)
        }
    });

    return songData;
}