import type { Key } from "./key";

export enum MidiCommand {
	NOTE_ON = 0,
	NOTE_OFF = 1,
}

export interface Midi {
	readonly command: MidiCommand;
	readonly key: Key;
}

export type MidiEventHandler = (midiEvent: Midi) => void;
