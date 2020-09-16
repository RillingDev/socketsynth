// Based on https://en.wikipedia.org/wiki/Piano_key_frequencies
const A = 2 ** (1 / 12);
const getKeyFreqByKeyPos = (nthPianoKey: number): number =>
    A ** (nthPianoKey - 49) * 440;

export const TONES = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
];

// Get the relative position to A0; Can be negative
const getKeyPos = (key: Key): number => {
    const index = TONES.indexOf(key.tone) - 9; // Index, but based on "A" (-9).
    return key.octave * 12 + index + 1; // increased by one because piano position are 1-based
};

export interface Key {
    readonly tone: string;
    readonly octave: number;
}

export const getKeyFreq = (key: Key): number =>
    getKeyFreqByKeyPos(getKeyPos(key));

export const getKeyString = (key: Key): string => `${key.tone}${key.octave}`;
