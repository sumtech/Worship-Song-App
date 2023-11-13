// ♮♭♯𝄪♪♫

// All the keys.
// When multiple names could be used for the same key, the most common one is used.
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

export const KeyMap: { [key: string]: Key } = {
    "A♭": Key["A♭"],
    "A": Key.A,
    "A#": Key["B♭"],
    "B♭": Key["B♭"],
    "B": Key.B,
    "B#": Key.C,
    "C♭": Key.B,
    "C": Key.C,
    "C#": Key["C#"],
    "D♭": Key["C#"],
    "D": Key.D,
    "D#": Key["E♭"],
    "E♭": Key["E♭"],
    "E": Key.E,
    "E#": Key.F,
    "F♭": Key.E,
    "F": Key.F,
    "F#": Key["F#"],
    "G♭": Key["F#"],
    "G": Key.G,
    "G#": Key["A♭"],
}

// The modifiers that are used to adjust keys.
export enum KeyModifier {
    "♭♭" = -2,
    "♭" = -1,
    "♮" = 0,
    "#" = 1,
    "𝄪" = 2,
}

type KeyMetadata = {
    key: Key,
    isUsable: boolean,
    keyModifiers: KeyModifier,
    useWithSharps: boolean,
    useWithFlats: boolean,
}

export const KeyMap2: {[key: string]: KeyMetadata} = {
    "A♭": { key: Key["A♭"], isUsable: true, keyModifiers: KeyModifier["♭"], useWithSharps: false, useWithFlats: true },
    "A": { key: Key.A, isUsable: true, keyModifiers: KeyModifier["#"], useWithSharps: true, useWithFlats: true },
    "A#": { key: Key["B♭"], isUsable: false, keyModifiers: KeyModifier["#"], useWithSharps: true, useWithFlats: false },
    "B♭": { key: Key["B♭"], isUsable: true, keyModifiers: KeyModifier["♭"], useWithSharps: false, useWithFlats: true },
    "B": { key: Key.B, isUsable: true, keyModifiers: KeyModifier["#"], useWithSharps: true, useWithFlats: true },
    "B#": { key: Key.C, isUsable: false, keyModifiers: KeyModifier["#"], useWithSharps: true, useWithFlats: false },
    "C♭": { key: Key.B, isUsable: false, keyModifiers: KeyModifier["♭"], useWithSharps: false, useWithFlats: true },
    "C": { key: Key.C, isUsable: true, keyModifiers: KeyModifier["♮"], useWithSharps: true, useWithFlats: true },
    "C#": { key: Key["C#"], isUsable: true, keyModifiers: KeyModifier["#"], useWithSharps: true, useWithFlats: false },
    "D♭": { key: Key["C#"], isUsable: true, keyModifiers: KeyModifier["♭"], useWithSharps: false, useWithFlats: true },
    "D": { key: Key.D, isUsable: true, keyModifiers: KeyModifier["#"], useWithSharps: true, useWithFlats: true },
    "D#": { key: Key["E♭"], isUsable: false, keyModifiers: KeyModifier["#"], useWithSharps: true, useWithFlats: false },
    "E♭": { key: Key["E♭"], isUsable: true, keyModifiers: KeyModifier["♭"], useWithSharps: false, useWithFlats: true },
    "E": { key: Key.E, isUsable: true, keyModifiers: KeyModifier["#"], useWithSharps: true, useWithFlats: true },
    "E#": { key: Key.F, isUsable: false, keyModifiers: KeyModifier["#"], useWithSharps: true, useWithFlats: false },
    "F♭": { key: Key.E, isUsable: false, keyModifiers: KeyModifier["♭"], useWithSharps: false, useWithFlats: true },
    "F": { key: Key.F, isUsable: true, keyModifiers: KeyModifier["♭"], useWithSharps: true, useWithFlats: true },
    "F#": { key: Key["F#"], isUsable: true, keyModifiers: KeyModifier["#"], useWithSharps: true, useWithFlats: false },
    "G♭": { key: Key["F#"], isUsable: true, keyModifiers: KeyModifier["♭"], useWithSharps: false, useWithFlats: true },
    "G": { key: Key.G, isUsable: true, keyModifiers: KeyModifier["#"], useWithSharps: true, useWithFlats: true },
    "G#": { key: Key["A♭"], isUsable: true, keyModifiers: KeyModifier["#"], useWithSharps: true, useWithFlats: false },
}

// Types of chords.
export enum ChordType {
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

    // 1, 3♭, 5, 7♭, 9
    MinorNinth,

    // 1, 5
    MajorMissingThird,

    // 1, 3, 5#
    Augmented,

    // 1, 3♭, 5♭
    Diminished,
}