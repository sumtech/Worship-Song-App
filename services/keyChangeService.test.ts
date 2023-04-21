import { getKey, Key, transpose } from "./keyChangeService";

describe('getKey', () => {
    const cases: [value: string | undefined | null, expected: Key | null][] = [
        ['A♭', Key["A♭"]],
        ['Ab', Key["A♭"]],
        ['A', Key.A],
        ['A#', Key["B♭"]],

        ['B♭', Key["B♭"]],
        ['Bb', Key["B♭"]],
        ['B', Key.B],
        ['B#', Key.C],

        ['C♭', Key.B],
        ['Cb', Key.B],
        ['C', Key.C],
        ['C#', Key["C#"]],

        ['D♭', Key["C#"]],
        ['Db', Key["C#"]],
        ['D', Key.D],
        ['D#', Key["E♭"]],

        ['E♭', Key["E♭"]],
        ['Eb', Key["E♭"]],
        ['E', Key.E],
        ['E#', Key.F],

        ['F♭', Key.E],
        ['Fb', Key.E],
        ['F', Key.F],
        ['F#', Key["F#"]],

        ['G♭', Key["F#"]],
        ['Gb', Key["F#"]],
        ['G', Key.G],
        ['G#', Key["A♭"]],

        ['X', null],
        ['', null],
        [undefined, null],
        [null, null],
    ]

    test.each(cases)('%p returns correct key', (value, expected) => {
        const actual = getKey(value as string);
        expect(actual).toBe(expected);
    });
});

describe('transpose', () => {
    const sameKeyCases: [value: string | undefined | null, key: Key, expected: string][] = [
        ["C", Key.C, "C"],
        ["Cm", Key.C, "Cm"],
        ["Csus", Key.C, "Csus"],
        ["Csus4", Key.C, "Csus"],
        ["C7", Key.C, "C7"],
        ["CM7", Key.C, "C7"],
        ["Cmaj7", Key.C, "C7"],
        ["Cm7", Key.C, "Cm7"],
        ["Csus7", Key.C, "Csus7"],
        ["C2", Key.C, "C2"],
        ["Csus2", Key.C, "C2"],
        ["Cmaj9", Key.C, "Cmaj9"],
        ["C9", Key.C, "C9"],
        ["Cadd9", Key.C, "C9"],
        ["C5", Key.C, "C5"],
        ["C(no3)", Key.C, "C5"],
    ];

    const changingKeyCases: [value: string | undefined | null, originalKey: Key, newKey: Key, expected: string][] = [
        ["A", Key.A, Key.B, "B"],

        // Simple Transposition
        ["G", Key.G, Key.E, "E"],
        ["C", Key.G, Key.E, "A"],
        ["C2", Key.G, Key.E, "A2"],
        ["D", Key.G, Key.E, "B"],
        ["Em", Key.G, Key.E, "C#m"],
        ["Em7", Key.G, Key.E, "C#m7"],
        ["D/F#", Key.G, Key.E, "B/E♭"],

        // Large Transposition
        ["F", Key.F, Key.B, "B"],
        ["Bb", Key.F, Key.B, "E"],
        ["C", Key.F, Key.B, "F#"],

        // Small Transposition
        ["B", Key.B, Key.F, "F"],
        ["E", Key.B, Key.F, "B♭"],
        ["F#", Key.B, Key.F, "C"],

        // Transposition of 0<->11
        ["A♭", Key["A♭"], Key.G, "G"],
        ["D♭", Key["A♭"], Key.G, "C"],
        ["E♭", Key["A♭"], Key.G, "D"],

        ["G", Key.G, Key["A♭"], "A♭"],
        ["C", Key.G, Key["A♭"], "C#"],
        ["D", Key.G, Key["A♭"], "E♭"],
    ];

    test.each(sameKeyCases)('Converts %p to the correct value when not transposing.', (value, key, expected) => {
        const actual = transpose(value as string, key, key);
        expect(actual).toBe(expected);
    });

    test.each(changingKeyCases)('Transposes %p from the key of %p to the key of %p.', (value, originalKey, newKey, expected) => {
        const actual = transpose(value as string, originalKey, newKey);
        expect(actual).toBe(expected);
    });
});