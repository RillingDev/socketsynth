// Based on https://en.wikipedia.org/wiki/Piano_key_frequencies
const A = 2 ** (1 / 12);
const getFreqByKeyPos = (nthPianoKey: number): number =>
    A ** (nthPianoKey - 49) * 440;

export const KEYS = [
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
const getNotePianoKeyPos = (note: Note): number => {
    const index = KEYS.indexOf(note.key) - 9; // Index, but based on "A" (-9).
    return note.octave * 12 + index + 1; // increased by one because piano position are 1-based
};

export interface Note {
    readonly key: string;
    readonly octave: number;
}

export const getNoteFreq = (note: Note): number =>
    getFreqByKeyPos(getNotePianoKeyPos(note));

export const getNoteString = (note: Note): string =>
    `${note.key}${note.octave}`;
