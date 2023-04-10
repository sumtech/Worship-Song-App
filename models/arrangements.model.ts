import { Song } from './songs.model';

// Represents an arrangement of a song.
export type Arrangement = {
    // The unique identifier for the arrangement.
    id: number;

    // The song to which this arrangment is designated.
    song: Song;

    // The main key in which the arrangment is written.
    key: NaturalSongKey;

    // The indicatino of whether the key is sharp, flat, or natural.
    keyVariation: SongKeyVariation;

    // The contents of the arrangement with HTML tags incorporated.
    chords: string;

    // The lyrics for the arrangement
    lyrics: string;

    // Notes about the arrangment.
    notes: string;
}

// The natural keys.
export enum NaturalSongKey {
    // The key of A
    A = 2,

    // The key of B
    B = 4,

    // The key of C
    C = 5,

    // The key of D
    D = 7,

    // The key of E
    E = 9,

    // The key of F
    F = 10,

    // The key of G
    G = 12,
}

// Indicator as to whether a key is sharped, flatted, or neither.
export enum SongKeyVariation {
    // A flatted key, such as Bb.
    Flat = -1,

    // A key which is not flatted or sharped.
    Natural = 0,

    // A sharped key, such as C#.
    Sharp = 1,
}
