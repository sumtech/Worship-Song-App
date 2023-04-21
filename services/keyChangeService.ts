// All the keys.
// When multiple names could be used for the same key, the most common one is used.
// References:
//      https://en.wikipedia.org/wiki/List_of_chords
//      https://www.guitar-chord.org/chord-types.html
//      https://www.worshiparts.net/resources/worship-training/ultimate-guide-to-understanding-worship-chords/
//      https://hellomusictheory.com/learn/types-of-chords/

// ♭♯𝄪♪♫

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
enum KeyModifiers {
    "♭♭" = -2,
    "♭" = -1,
    "#" = 1,
    "𝄪" = 2,
}

// Alternative names for keys that have multiple names.
enum OddKey {
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

// Types of chords.
enum ChordType {
    // 1, 3, 5
    Major,

    // 1, 3♭, 5
    Minor,

    // 1, 4, 5
    Suspended,

    // 1, 3, 5, 6
    MajorSixth,

    // 1, 3, 5, 7
    MajorSeventh,

    // 1, 3♭, 5, 7
    MinorSeventh,

    // 1, 4, 5, 7
    SuspendedMinorSeventh,

    // 1, 2, 5
    MajorSuspended2,

    // 1, 3, 5, 7, 9
    MajorNinth,

    // 1, 2, 3, 5
    MajorAddNinth,

    // 1, 5
    MajorMissingThird,

    // 1, 3, 5#
    Augmented,

    // 1, 3♭, 5♭
    Diminished,
}

/**
 * Convert a value to the appropriate key.
 * @param value The chord value.
 * @returns The key, or null if not recognized.
 */
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

/**
 * Calculates the number of keys to change.
 * @param originalKey The original song key.
 * @param newKey The new song key.
 * @returns The key change indicator.
 */
const getKeyChange = (originalKey: Key, newKey: Key): number => {
    return newKey - originalKey;
}

const getChordParts = (value: string): { chordType: ChordType, chord: string } => {
    // Augmented
    if (value.endsWith("+")) {
        return {
            chordType: ChordType.Augmented,
            chord: value.slice(0, value.length - 1),
        };
    }

    if (value.endsWith("aug")) {
        return {
            chordType: ChordType.Augmented,
            chord: value.slice(0, value.length - 3),
        };
    }

    // Diminished
    if (value.endsWith("o")) {
        return {
            chordType: ChordType.Diminished,
            chord: value.slice(0, value.length - 1),
        };
    }

    if (value.endsWith("dim")) {
        return {
            chordType: ChordType.Diminished,
            chord: value.slice(0, value.length - 3),
        };
    }

    // Minor
    if (value.endsWith("m")) {
        return {
            chordType: ChordType.Minor,
            chord: value.slice(0, value.length - 1),
        };
    }

    if (value.endsWith("min")) {
        return {
            chordType: ChordType.Minor,
            chord: value.slice(0, value.length - 3),
        };
    }

    // Suspended
    if (value.endsWith("sus")) {
        return {
            chordType: ChordType.Suspended,
            chord: value.slice(0, value.length - 3),
        };
    }

    if (value.endsWith("sus4")) {
        return {
            chordType: ChordType.Suspended,
            chord: value.slice(0, value.length - 4),
        };
    }

    // Major 6th
    if (value.endsWith("6")) {
        return {
            chordType: ChordType.MajorSixth,
            chord: value.slice(0, value.length - 1),
        };
    }

    // Minor 7th
    if (value.endsWith("m7")) {
        return {
            chordType: ChordType.MinorSeventh,
            chord: value.slice(0, value.length - 2),
        };
    }

    // Suspended Minor 7th
    if (value.endsWith("sus7")) {
        return {
            chordType: ChordType.SuspendedMinorSeventh,
            chord: value.slice(0, value.length - 4),
        };
    }

    // Major 7th
    if (value.endsWith("maj7")) {
        return {
            chordType: ChordType.MajorSeventh,
            chord: value.slice(0, value.length - 4),
        };
    }

    if (value.endsWith("M7")) {
        return {
            chordType: ChordType.MajorSeventh,
            chord: value.slice(0, value.length - 2),
        };
    }

    if (value.endsWith("7")) {
        return {
            chordType: ChordType.MajorSeventh,
            chord: value.slice(0, value.length - 1),
        };
    }

    // Major Suspended 2
    if (value.endsWith("sus2")) {
        return {
            chordType: ChordType.MajorSuspended2,
            chord: value.slice(0, value.length - 4),
        };
    }

    if (value.endsWith("2")) {
        return {
            chordType: ChordType.MajorSuspended2,
            chord: value.slice(0, value.length - 1),
        };
    }

    // Major 9th
    if (value.endsWith("maj9")) {
        return {
            chordType: ChordType.MajorNinth,
            chord: value.slice(0, value.length - 4),
        };
    }

    // Major Add 9
    if (value.endsWith("add9")) {
        return {
            chordType: ChordType.MajorAddNinth,
            chord: value.slice(0, value.length - 4),
        };
    }

    if (value.endsWith("9")) {
        return {
            chordType: ChordType.MajorAddNinth,
            chord: value.slice(0, value.length - 1),
        };
    }

    // Major Missing 3rd
    if (value.endsWith("5")) {
        return {
            chordType: ChordType.MajorMissingThird,
            chord: value.slice(0, value.length - 1),
        };
    }

    if (value.endsWith("(no3)")) {
        return {
            chordType: ChordType.MajorMissingThird,
            chord: value.slice(0, value.length - 5),
        };
    }

    // Major
    return {
        chordType: ChordType.Major,
        chord: value
    };;
}

/**
 * Gets the complete chord value.
 * @param chordType The type of chord.
 * @param chord The chord value.
 * @returns The complete chord value.
 */
const getChord = (chordType: ChordType, chord: string): string => {
    switch (chordType) {
        case ChordType.Major:
            return chord;

        case ChordType.Minor:
            return `${chord}m`;

        case ChordType.Suspended:
            return `${chord}sus`;

        case ChordType.MajorSixth:
            return `${chord}6`;

        case ChordType.MajorSeventh:
            return `${chord}7`;

        case ChordType.MinorSeventh:
            return `${chord}m7`;

        case ChordType.SuspendedMinorSeventh:
            return `${chord}sus7`;

        case ChordType.MajorSuspended2:
            return `${chord}2`;

        case ChordType.MajorNinth:
            return `${chord}maj9`;

        case ChordType.MajorAddNinth:
            return `${chord}9`;

        case ChordType.MajorMissingThird:
            return `${chord}5`;

        case ChordType.Augmented:
            return `${chord}+`;

        case ChordType.Diminished:
            return `${chord}o`;

        default:
            return chord;
    }
}

/**
 * Transposes a chord value.
 * @param value The chord value.
 * @param change The change value for how many keys over to transpose.
 * @returns The new chord.
 */
const transposeChord = (value: string, change: number): string => {
    const key = getKey(value);
    if (key === null) return "?";

    let newKey = key + change;
    if (newKey > 11) {
        newKey = newKey - 12;
    } else if (newKey < 0) {
        newKey = 12 + newKey;
    }

    return Key[newKey];
}

/**
 * Transpose the chord within the original text.
 * @param original Original text.
 * @param originalKey Original song key.
 * @param newKey New song key.
 * @returns New text.
 */
export const transpose = (original: string, originalKey: Key, newKey: Key): string => {
    const change: number = getKeyChange(originalKey, newKey);

    return original.split('/')
        .map((value) => getChordParts(value))
        .map((value) => getChord(value.chordType, transposeChord(value.chord, change)))
        .join('/');


}
