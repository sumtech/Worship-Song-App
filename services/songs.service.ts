import path from "path";
import { promises as fs } from 'fs';

/**
 * Here are the rules and notes for creating the song files.
 *  * Metadata
 *      * The top section should contain metadata information in the format of "Metadata Name: Metadata Value".
 *      * Each piece of metadata should be on its own line.
 *      * Each file should at least have Title and Author (or Authors) in the metadata.
 *      * Each metadata name should be unique. For example, Authors can be used to add a comma-separated list of authors.
 *        Or Source 1 and Source 2 could be used to reference separate sources where different information came from.
 *        Adding two Author entries for metadata will cause only one of them to be used (likely the last one).
 *  * Lyrics/Chords
 *      * Each line should contain both the lyrics for that line as well as the chord information.
 *      * Chords should be entered where the chord is played in the format of "{A}", "{C#}", or "{B♭}".
 *        Keys are expected to be uppercase.
 *        A lowercase "b" may also be used in place of the flat symbol and it will be converted.
 *      * The type of chord information can be in the chord as well, i.e., {Am}, {A/C#}, {A7} 
 */

// A summary of information for a song.
export type SongSummary = {
    title: string,
    author: string,
    identifier: string,
    metadata: { [key: string]: string },
}

// All the information for a song, including lyrics and chords.
export type SongData = {
    // The collection of metadata about the song.
    metadata: { [key: string]: string },

    // The sections of the song containing information to present for that particular section.
    sections: {
        // The title of the section (i.e., Verse, Chorus, Bridge, Verse #, etc.)
        title: string,

        // The collection of raw lines of content.
        content: string[],

        // The collection of lines of content with HTML styling for the chords.
        styledContent: string[],

        // The collection of lines of content with chords stripped out to keep only the lyrics.
        lyrics: string[],
    }[],
}

// This is the marker to use within the files to separate the metadata header section from the lyric/chord content section.
const endHeaderMarker = '==========';

/**
 * Gets the list of all song summaries.
 * @returns The list of songs.
 */
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

/**
 * Gets the raw contents of a song file.
 * @param identifier The identifier for the song, based on how the file is named. i.e., "worthy-of-it-all"
 * @returns The raw contents of the song file.
 */
export const getSongFileContents = async (identifier: string): Promise<string> => {
    const fileDirectory = path.join(process.cwd(), 'song-files');
    const filePath = `${fileDirectory}/${identifier}.txt`;
    return await fs.readFile(filePath, { encoding: 'utf-8' });
}

/**
 * Adds metadata information from a line of text to the song data object.
 * @param line The contents of a line of text.
 * @param songData The song data object.
 */
const addMetadataToSongData = (line: string, songData: SongData): void => {
    const [name, value] = line.split(':').map(chunk => chunk.trim());
    songData.metadata[name.toLowerCase()] = value;
};

/**
 * Adds lyric/chord information to the song data object.
 * @param line The contents of a line of text.
 * @param songData The song data object.
 * @param chordClassName The CSS class name to use for the chord.
 */
const addContentToSongData = (line: string, songData: SongData, chordClassName: string | undefined): void => {
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
    const styledLine = line.replaceAll(/\{(.*?)\}/ig, `<span class="${chordClassName}">$1</span>`);
    songData.sections.slice(-1)[0].styledContent.push(styledLine);
    const lyrics = line.replaceAll(/\{(.*?)\}/ig, '')
    songData.sections.slice(-1)[0].lyrics.push(lyrics);
}

// The options used when generating a song data object.
export type SongDataOptions = {
    chordClassName?: string;
    metadataOnly?: boolean;
}

/**
 * Generates the song data from the raw file contents.
 * @param fileContents The raw contents of a file.
 * @param options The options used when generating the song data object.
 * @returns The song data.
 */
export const getSongDataFromFileContents = (fileContents: string, options?: SongDataOptions): SongData => {
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

            addContentToSongData(trimmedContent, songData, options?.chordClassName)
        }
    });

    return songData;
}