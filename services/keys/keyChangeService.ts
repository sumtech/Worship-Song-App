
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

type ChordParts = {
    chordType: ChordType;
    chordKey: string;
    isOptional?: boolean;
}

/**
 * Gets the parts of the chord.
 * @param chord The chord.
 * @returns The information to build the chord.
 */
const getChordParts = (chord: string): ChordParts => {
    let isOptional: boolean = false;
    if (chord[0] === '(' && chord[chord.length - 1] === ')') {
        isOptional = true;
        chord = chord.slice(1, -1);
    }

    // Augmented
    if (chord.endsWith("+")) {
        return {
            chordType: ChordType.Augmented,
            chordKey: chord.slice(0, chord.length - 1),
            isOptional,
        };
    }

    if (chord.endsWith("aug")) {
        return {
            chordType: ChordType.Augmented,
            chordKey: chord.slice(0, chord.length - 3),
            isOptional,
        };
    }

    // Diminished
    if (chord.endsWith("o")) {
        return {
            chordType: ChordType.Diminished,
            chordKey: chord.slice(0, chord.length - 1),
            isOptional,
        };
    }

    if (chord.endsWith("dim")) {
        return {
            chordType: ChordType.Diminished,
            chordKey: chord.slice(0, chord.length - 3),
            isOptional,
        };
    }

    // Minor
    if (chord.endsWith("m")) {
        return {
            chordType: ChordType.Minor,
            chordKey: chord.slice(0, chord.length - 1),
            isOptional,
        };
    }

    if (chord.endsWith("min")) {
        return {
            chordType: ChordType.Minor,
            chordKey: chord.slice(0, chord.length - 3),
            isOptional,
        };
    }

    // Suspended
    if (chord.endsWith("sus")) {
        return {
            chordType: ChordType.Suspended,
            chordKey: chord.slice(0, chord.length - 3),
            isOptional,
        };
    }

    if (chord.endsWith("sus4")) {
        return {
            chordType: ChordType.Suspended,
            chordKey: chord.slice(0, chord.length - 4),
            isOptional,
        };
    }

    // Major 6th
    if (chord.endsWith("6")) {
        return {
            chordType: ChordType.MajorSixth,
            chordKey: chord.slice(0, chord.length - 1),
            isOptional,
        };
    }

    // Minor 7th
    if (chord.endsWith("m7")) {
        return {
            chordType: ChordType.MinorSeventh,
            chordKey: chord.slice(0, chord.length - 2),
            isOptional,
        };
    }

    // Suspended Minor 7th
    if (chord.endsWith("sus7")) {
        return {
            chordType: ChordType.SuspendedMinorSeventh,
            chordKey: chord.slice(0, chord.length - 4),
            isOptional,
        };
    }

    // Major 7th
    if (chord.endsWith("maj7")) {
        return {
            chordType: ChordType.MajorSeventh,
            chordKey: chord.slice(0, chord.length - 4),
            isOptional,
        };
    }

    if (chord.endsWith("M7")) {
        return {
            chordType: ChordType.MajorSeventh,
            chordKey: chord.slice(0, chord.length - 2),
            isOptional,
        };
    }

    if (chord.endsWith("7")) {
        return {
            chordType: ChordType.MajorSeventh,
            chordKey: chord.slice(0, chord.length - 1),
            isOptional,
        };
    }

    // Major Suspended 2
    if (chord.endsWith("sus2")) {
        return {
            chordType: ChordType.MajorSuspended2,
            chordKey: chord.slice(0, chord.length - 4),
            isOptional,
        };
    }

    if (chord.endsWith("2")) {
        return {
            chordType: ChordType.MajorSuspended2,
            chordKey: chord.slice(0, chord.length - 1),
            isOptional,
        };
    }

    // Major 9th
    if (chord.endsWith("maj9")) {
        return {
            chordType: ChordType.MajorNinth,
            chordKey: chord.slice(0, chord.length - 4),
            isOptional,
        };
    }

    // Major Add 9
    if (chord.endsWith("add9")) {
        return {
            chordType: ChordType.MajorAddNinth,
            chordKey: chord.slice(0, chord.length - 4),
            isOptional,
        };
    }

    if (chord.endsWith("9")) {
        return {
            chordType: ChordType.MajorAddNinth,
            chordKey: chord.slice(0, chord.length - 1),
            isOptional,
        };
    }

    // Major Missing 3rd
    if (chord.endsWith("5")) {
        return {
            chordType: ChordType.MajorMissingThird,
            chordKey: chord.slice(0, chord.length - 1),
            isOptional,
        };
    }

    if (chord.endsWith("(no3)")) {
        return {
            chordType: ChordType.MajorMissingThird,
            chordKey: chord.slice(0, chord.length - 5),
            isOptional,
        };
    }

    // Major
    return {
        chordType: ChordType.Major,
        chordKey: chord,
        isOptional,
    };
}

/**
 * Gets the complete chord value.
 * @param chordType The type of chord.
 * @param chordKey The chord key value.
 * @returns The complete chord value.
 */
const getChord = (chordParts: ChordParts): string => {
    let chord;
    switch (chordParts.chordType) {
        case ChordType.Major:
            chord = chordParts.chordKey;
            break;

        case ChordType.Minor:
            chord = `${chordParts.chordKey}m`;
            break;

        case ChordType.Suspended:
            chord = `${chordParts.chordKey}sus`;
            break;

        case ChordType.MajorSixth:
            chord = `${chordParts.chordKey}6`;
            break;

        case ChordType.MajorSeventh:
            chord = `${chordParts.chordKey}7`;
            break;

        case ChordType.MinorSeventh:
            chord = `${chordParts.chordKey}m7`;
            break;

        case ChordType.SuspendedMinorSeventh:
            chord = `${chordParts.chordKey}sus7`;
            break;

        case ChordType.MajorSuspended2:
            chord = `${chordParts.chordKey}2`;
            break;

        case ChordType.MajorNinth:
            chord = `${chordParts.chordKey}maj9`;
            break;

        case ChordType.MajorAddNinth:
            chord = `${chordParts.chordKey}9`;
            break;

        case ChordType.MajorMissingThird:
            chord = `${chordParts.chordKey}5`;
            break;

        case ChordType.Augmented:
            chord = `${chordParts.chordKey}+`;
            break;

        case ChordType.Diminished:
            chord = `${chordParts.chordKey}o`;
            break;

        default:
            chord = chordParts.chordKey;
            break;
    }

    if (chordParts.isOptional) {
        return `(${chord})`;
    }

    return chord;
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
        .map((chordParts) => getChord({ ...chordParts, chordKey: transposeChord(chordParts.chordKey, indexChange, newKeyIndex)} ))
        .join('/');
}
