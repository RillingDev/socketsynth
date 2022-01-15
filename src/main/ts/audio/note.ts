import type { Note } from "../messaging/midiChannelMessage";

export type Tone =
	| "A"
	| "A#"
	| "B"
	| "C"
	| "C#"
	| "D"
	| "D#"
	| "E"
	| "F"
	| "F#"
	| "G"
	| "G#";

export const TONES_RELATIVE_TO_C: Tone[] = [
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
Object.freeze(TONES_RELATIVE_TO_C);

const OCTAVE_SIZE = 12;
export const getNoteForKey = (tone: Tone, octave: number): Note => {
	const relativeTonePos = TONES_RELATIVE_TO_C.indexOf(tone);
	const relativeOctave = octave + 1;
	const note = relativeOctave * OCTAVE_SIZE + relativeTonePos;
	if (note < 0 || note > 127) {
		throw new TypeError("Note out of range");
	}
	return note;
};

export const getStringForNote = (note: Note): string => {
	const relativeTonePos = note % OCTAVE_SIZE;
	const tone = TONES_RELATIVE_TO_C[relativeTonePos];
	const relativeOctave = (note - relativeTonePos) / OCTAVE_SIZE;
	const octave = relativeOctave - 1;
	return `${tone}${octave}`;
};
