import { Key } from "./keys";
import { getKeyIndex, transpose } from "./keys/keyChangeService";
import { SongFileData } from "./songFileService";

/**
 * Here are the rules and notes for creating the song files.
 *  * Metadata
 *      * The top section should contain metadata information in the format of "Metadata Name: Metadata Value".
 *      * Each piece of metadata should be on its own line.
 *      * Each file should at least have Title and Author (or Authors) in the metadata.
 *      * Key or Main Key need to be added for key changing functionality to work.
 *        The value should just be the simple key, i.e., "A" or "Am". Key changing functionality will not work if the chord is not recognized.
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
    mainKey: Key | null,
    identifier: string,
    metadata: { [key: string]: string },
}

// All the information for a song, including lyrics and chords.
export type SongData = {
    // The original file contents.
    originalSongFileData: SongFileData;

    // The original main key for the song.
    originalMainKey?: Key,

    // The main key for the song.
    mainKey?: Key,

    // The collection of metadata about the song.
    metadata: { [key: string]: string },

    // The sections of the song containing information to present for that particular section.
    sections: {
        // The title of the section (i.e., Verse, Chorus, Bridge, Verse #, etc.)
        title: string,

        // The collection of raw lines of content.
        originalLines: string[],

        // The collection of lines of content with HTML styling for the chords.
        chordedLines: string[],

        // The collection of lines of content with chords stripped out to keep only the lyrics.
        lyricLines: string[],
    }[],
}

// This is the marker to use within the files to separate the metadata header section from the lyric/chord content section.
const endHeaderMarker = '==========';

/**
 * Adds metadata information from a line of text to the song data object.
 * @param line The contents of a line of text.
 * @param songData The song data object.
 */
const addMetadataToSongData = (line: string, songData: SongData): void => {
    const [name, value] = line.split(':').map(chunk => chunk.trim());
    songData.metadata[name.toLowerCase().replaceAll(' ', '_')] = value;
};

/**
 * Adds lyric/chord information to the song data object.
 * @param line The contents of a line of text.
 * @param songData The song data object.
 * @param chordClassName The CSS class name to use for the chord.
 * @param newKey The new key to use for the song.
 */
const addContentToSongData = (line: string, songData: SongData, chordClassName: string | undefined, newKey: Key | undefined): void => {
    // Check for heading.
    if (line[0] === '[') {
        songData.sections.push({
            title: line.slice(1, line.length - 1),
            originalLines: [],
            chordedLines: [],
            lyricLines: [],
        });
        return;
    }

    // Initialize first section if needed.
    if (!songData.sections.length) {
        songData.sections.push({
            title: '',
            originalLines: [],
            chordedLines: [],
            lyricLines: [],
        });
    }

    // TODO: Remove spaces from inside chord markers.
    line = line.replaceAll(/\{(.*?)\}/ig, (_match, capture) => `{${capture.trim()}}`);

    // Transpose chords.
    if (newKey !== undefined || songData.originalMainKey !== undefined) {
        line = line.replaceAll(/\{(.*?)\}/ig, (_match, capture) =>
            `{${transpose(capture, songData.originalMainKey as Key, newKey ?? songData.originalMainKey as number)}}`);
    }

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
    songData.sections.slice(-1)[0].originalLines.push(line);
    const styledLine = line.replaceAll(/\{(.*?)\}/ig, `<span class="${chordClassName}">$1</span>`);
    songData.sections.slice(-1)[0].chordedLines.push(styledLine);
    const lyrics = line.replaceAll(/\{(.*?)\}/ig, '')
    songData.sections.slice(-1)[0].lyricLines.push(lyrics);
}

// The options used when generating a song data object.
export type SongDataOptions = {
    metadataOnly?: boolean;
    newKey?: Key;
    chordClassName?: string;
}

/**
 * Generates the song data from the raw file contents.
 * @param songFileData The raw contents of a file.
 * @param options The options used when generating the song data object.
 * @returns The song data.
 */
export const getSongDataFromFileContents = (songFileData: SongFileData, options?: SongDataOptions): SongData => {
    const metadataLines = songFileData.metadataContents.replaceAll('\r\n', '\n').split('\n');
    const songLines = songFileData.songContents.replaceAll('\r\n', '\n').split('\n');

    let songData: SongData = {
        originalSongFileData: songFileData,
        metadata: {},
        sections: [],
    }

    metadataLines.forEach((line) => {
        if (line.indexOf(':') === -1) return;

        addMetadataToSongData(line, songData);
    });

    const key = getKeyIndex(songData.metadata.key || songData.metadata.main_key);
    if (key) {
        songData.originalMainKey = key;
        songData.mainKey = options?.newKey ?? songData.originalMainKey;
    }

    songLines.forEach((line) => {
        if (options?.metadataOnly) return;

        const trimmedContent = line.trim();
        if (!trimmedContent) return;

        addContentToSongData(trimmedContent, songData, options?.chordClassName, options?.newKey);
    });

    return songData;
}

/**
 * Gets the list of all song summaries.
 * @returns The list of songs.
 */
export const getSongListSummaries = async (songFileDataList: SongFileData[]): Promise<SongSummary[]> => {
    return songFileDataList.map((songFileData) => {
        const songData = getSongDataFromFileContents(songFileData, { metadataOnly: true });
        const songSummary: SongSummary = {
            title: songData.metadata.title ?? '<<Title goes here>>',
            author: songData.metadata.author || songData.metadata.authors || '<<Author goes here>>',
            mainKey: getKeyIndex(songData.metadata.key) || getKeyIndex(songData.metadata.main_key) || null,
            identifier: songFileData.identifier,
            metadata: songData.metadata,
        };
        return songSummary;
    });
}