// All the keys.
// When multiple names could be used for the same key, the most common one is used.

import { SongData } from "./songsService";

// The numerical enumerations can be used when transposing.
export enum Key {
    "A♭" = 0,
    "A" = 1,
    "B♭" = 2,
    "B" = 3,
    "C" = 4,
    "C#" = 5,
    "D" = 6,
    "E♭" = 7,
    "E" = 8,
    "F" = 9,
    "F#" = 10,
    "G" = 11,
}

// The modifiers that are used to adjust keys.
export enum KeyModifiers {
    "♭♭" = -2,
    "♭" = -1,
    "#" = 1,
    "𝄪" = 2,
}

// Alternative names for keys that have multiple names.
export enum OddKey {
    "A#" = Key["B♭"],
    "B#" = Key.C,
    "C♭" = Key.B,
    "D♭" = Key["C#"],
    "D#" = Key["E♭"],
    "E#" = Key.F,
    "F♭" = Key.E,
    "G♭" = Key["F#"],
    "G#" = Key["A♭"],
}

export const getKey = (value: string): Key | null => {
    switch (value) {
        case "G#":
        case "A♭":
        case "Ab":
            return Key["A♭"];

        case "A":
            return Key.A;

        case "A#":
        case "B♭":
        case "Bb":
            return Key["B♭"];

        case "B":
        case "C♭":
        case "Cb":
            return Key.B;

        case "B#":
        case "C":
            return Key.C;

        case "C#":
        case "D♭":
        case "Db":
            return Key["C#"];

        case "D":
            return Key.D;

        case "D#":
        case "E♭":
        case "Eb":
            return Key["E♭"];

        case "E":
        case "F♭":
        case "Fb":
            return Key.E;

        case "E#":
        case "F":
            return Key.F;

        case "F#":
        case "G♭":
        case "Gb":
            return Key["F#"];

        case "G":
            return Key.G;

        default:
            return null;
    }
}

export const transpose = (original: string, originalKey: Key, newKey: Key): string => {
    return Key[newKey];
}
