import { getKey, Key } from "./keyChangeService";

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