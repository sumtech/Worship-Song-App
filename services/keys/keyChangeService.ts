
import { ChordType, Key, KeyMap, KeyMap2, KeyModifier } from "./keys.model";

/**
 * References:
 *      https://en.wikipedia.org/wiki/List_of_chords
 *      https://www.guitar-chord.org/chord-types.html
 *      https://www.worshiparts.net/resources/worship-training/ultimate-guide-to-understanding-worship-chords/
 *      https://hellomusictheory.com/learn/types-of-chords/
 *      https://www.musical-u.com/wp-content/uploads/2016/07/All-Keys-4-Chords-Reference.pdf
 */

/**
 * Main Chords for Each Key
 *      I   IV  V   vi
 *      A♭  D♭  E♭  Fm
 *      A   D   E   F#m
 *      A#              Use B♭ instead
 *      B♭  E♭  F   Gm
 *      B   E   F#  G#m
 *      B#              Use C instead
 *      C♭              Use B instead
 *      C   F   G   Am
 *      C#  F#  G#  A#m
 *      D♭  G♭  A♭  B♭m
 *      D   G   A   Bm
 *      D#              Use E♭ instead
 *      E♭  A♭  B♭  Cm
 *      E   A   B   C#m
 *      E#              Use F instead
 *      F♭              Use E instead
 *      F   B♭  C   Dm
 *      F#  B   C#  D#m
 *      G♭  C♭  D♭  E♭m
 *      G   C   D   Em
 *      G#              Use A♭ instead
 */

/**
 * Gets the enumeration index for the key.
 * @param key The visual value for the key.
 * @returns The index for the key.
 */
export const getKeyIndex = (key: string): number | null => {
    const cleanKey = key?.replaceAll(/b/g, '♭');
    return KeyMap[cleanKey] ?? null;
}

/**
 * Gets the visual value for the key relative to the main key of the song.
 * The key of the song is used when multiple versions (i.e., C# vs D♭) could be used.
 * @param chordKeyIndex The index for the chord key.
 * @param mainKey The main key of the song.
 * @returns The visual value for the key.
 */
const getChordKey = (chordKeyIndex: number, mainKey: string): string => {
    const mainKeyMetadata = KeyMap2[mainKey];

    const possibleKeys2 = Object.keys(KeyMap2).filter((property) => {
        const keyMetadata = KeyMap2[property];
        return keyMetadata.key === chordKeyIndex;
    });

    const possibleKeys = Object.keys(KeyMap2).filter((property) => {
        const keyMetadata = KeyMap2[property];
        return keyMetadata.key === chordKeyIndex;
    }).filter((property) => {
        const keyMetadata = KeyMap2[property];
        if (mainKeyMetadata.keyModifiers === KeyModifier["♭"]) {
            return keyMetadata.useWithFlats;
        }

        if (mainKeyMetadata.keyModifiers === KeyModifier["#"]) {
            return keyMetadata.useWithSharps;
        }

        return true;
    });

    if (possibleKeys.length === 1) return possibleKeys[0];

    if (possibleKeys.length !== 2) throw `There was an issue determining the correct chord key`;

    return possibleKeys.filter((property) => {
        return !property.endsWith("♭") && !property.endsWith("#");
    })[0];

    throw `There was not a single key returned. (${chordKeyIndex} - ${mainKey}) (${possibleKeys.length} - ${possibleKeys2.length}, ${possibleKeys2[0]})`;

    switch (chordKeyIndex) {
        case Key.A:
        case Key.B:
        case Key.C:
        case Key.D:
        case Key.E:
        case Key.F:
        case Key.G:
            return Key[chordKeyIndex] as string;

        case Key["A♭"]:
        case Key["B♭"]:
        case Key["C#"]:
        case Key["E♭"]:
        case Key["F#"]:
            return Key[chordKeyIndex] as string;

        default:
            throw `The correct correct could not be determined for ${chordKeyIndex} (${Key[chordKeyIndex]})`;
    }
}

/**
 * Calculates the number of keys to change.
 * @param originalKeyIndex The index for the original song key.
 * @param newKeyIndex The index for the new song key.
 * @returns The key change indicator.
 */
const getKeyChange = (originalKeyIndex: Key, newKeyIndex: Key): number => {
    return newKeyIndex - originalKeyIndex;
}

/**
 * Gets the parts of the chord.
 * @param chord The chord.
 * @returns The information to build the chord.
 */
const getChordParts = (chord: string): { chordType: ChordType, chordKey: string } => {
    // Augmented
    if (chord.endsWith("+")) {
        return {
            chordType: ChordType.Augmented,
            chordKey: chord.slice(0, chord.length - 1),
        };
    }

    if (chord.endsWith("aug")) {
        return {
            chordType: ChordType.Augmented,
            chordKey: chord.slice(0, chord.length - 3),
        };
    }

    // Diminished
    if (chord.endsWith("o")) {
        return {
            chordType: ChordType.Diminished,
            chordKey: chord.slice(0, chord.length - 1),
        };
    }

    if (chord.endsWith("dim")) {
        return {
            chordType: ChordType.Diminished,
            chordKey: chord.slice(0, chord.length - 3),
        };
    }

    // Minor
    if (chord.endsWith("m")) {
        return {
            chordType: ChordType.Minor,
            chordKey: chord.slice(0, chord.length - 1),
        };
    }

    if (chord.endsWith("min")) {
        return {
            chordType: ChordType.Minor,
            chordKey: chord.slice(0, chord.length - 3),
        };
    }

    // Suspended
    if (chord.endsWith("sus")) {
        return {
            chordType: ChordType.Suspended,
            chordKey: chord.slice(0, chord.length - 3),
        };
    }

    if (chord.endsWith("sus4")) {
        return {
            chordType: ChordType.Suspended,
            chordKey: chord.slice(0, chord.length - 4),
        };
    }

    // Major 6th
    if (chord.endsWith("6")) {
        return {
            chordType: ChordType.MajorSixth,
            chordKey: chord.slice(0, chord.length - 1),
        };
    }

    // Minor 7th
    if (chord.endsWith("m7")) {
        return {
            chordType: ChordType.MinorSeventh,
            chordKey: chord.slice(0, chord.length - 2),
        };
    }

    // Suspended Minor 7th
    if (chord.endsWith("sus7")) {
        return {
            chordType: ChordType.SuspendedMinorSeventh,
            chordKey: chord.slice(0, chord.length - 4),
        };
    }

    // Major 7th
    if (chord.endsWith("maj7")) {
        return {
            chordType: ChordType.MajorSeventh,
            chordKey: chord.slice(0, chord.length - 4),
        };
    }

    if (chord.endsWith("M7")) {
        return {
            chordType: ChordType.MajorSeventh,
            chordKey: chord.slice(0, chord.length - 2),
        };
    }

    if (chord.endsWith("7")) {
        return {
            chordType: ChordType.MajorSeventh,
            chordKey: chord.slice(0, chord.length - 1),
        };
    }

    // Major Suspended 2
    if (chord.endsWith("sus2")) {
        return {
            chordType: ChordType.MajorSuspended2,
            chordKey: chord.slice(0, chord.length - 4),
        };
    }

    if (chord.endsWith("2")) {
        return {
            chordType: ChordType.MajorSuspended2,
            chordKey: chord.slice(0, chord.length - 1),
        };
    }

    // Major 9th
    if (chord.endsWith("maj9")) {
        return {
            chordType: ChordType.MajorNinth,
            chordKey: chord.slice(0, chord.length - 4),
        };
    }

    // Major Add 9
    if (chord.endsWith("add9")) {
        return {
            chordType: ChordType.MajorAddNinth,
            chordKey: chord.slice(0, chord.length - 4),
        };
    }

    if (chord.endsWith("9")) {
        return {
            chordType: ChordType.MajorAddNinth,
            chordKey: chord.slice(0, chord.length - 1),
        };
    }

    // Major Missing 3rd
    if (chord.endsWith("5")) {
        return {
            chordType: ChordType.MajorMissingThird,
            chordKey: chord.slice(0, chord.length - 1),
        };
    }

    if (chord.endsWith("(no3)")) {
        return {
            chordType: ChordType.MajorMissingThird,
            chordKey: chord.slice(0, chord.length - 5),
        };
    }

    // Major
    return {
        chordType: ChordType.Major,
        chordKey: chord
    };
}

/**
 * Gets the complete chord value.
 * @param chordType The type of chord.
 * @param chordKey The chord key value.
 * @returns The complete chord value.
 */
const getChord = (chordType: ChordType, chordKey: string): string => {
    switch (chordType) {
        case ChordType.Major:
            return chordKey;

        case ChordType.Minor:
            return `${chordKey}m`;

        case ChordType.Suspended:
            return `${chordKey}sus`;

        case ChordType.MajorSixth:
            return `${chordKey}6`;

        case ChordType.MajorSeventh:
            return `${chordKey}7`;

        case ChordType.MinorSeventh:
            return `${chordKey}m7`;

        case ChordType.SuspendedMinorSeventh:
            return `${chordKey}sus7`;

        case ChordType.MajorSuspended2:
            return `${chordKey}2`;

        case ChordType.MajorNinth:
            return `${chordKey}maj9`;

        case ChordType.MajorAddNinth:
            return `${chordKey}9`;

        case ChordType.MajorMissingThird:
            return `${chordKey}5`;

        case ChordType.Augmented:
            return `${chordKey}+`;

        case ChordType.Diminished:
            return `${chordKey}o`;

        default:
            return chordKey;
    }
}

/**
 * Transposes a chord value.
 * @param chordKey The chord value.
 * @param indexChange The change value for how many keys over to transpose.
 * @param mainKeyIndex The main key for the song (used to determine flat vs sharp).
 * @returns The new chord.
 */
const transposeChord = (chordKey: string, indexChange: number, mainKeyIndex: number): string => {
    const keyIndex = getKeyIndex(chordKey);
    if (keyIndex === null) return "?";
    let newKeyIndex = keyIndex + indexChange;
    if (newKeyIndex > 11) {
        newKeyIndex = newKeyIndex - 12;
    } else if (newKeyIndex < 0) {
        newKeyIndex = 12 + newKeyIndex;
    }

    const mainKey = Key[mainKeyIndex];
    return getChordKey(newKeyIndex, mainKey);
}

/**
 * Transpose the chord within the original text.
 * @param original Original text.
 * @param originalKey Original song key.
 * @param newKey New song key.
 * @returns New text.
 */
export const transpose = (originalChord: string, originalKeyIndex: Key, newKeyIndex: Key): string => {
    const indexChange: number = getKeyChange(originalKeyIndex, newKeyIndex);

    return originalChord.split('/')
        .map((chord) => getChordParts(chord))
        .map((chord) => getChord(chord.chordType, transposeChord(chord.chordKey, indexChange, newKeyIndex)))
        .join('/');
}
