/**
 * MIDI notes are numbered from 0 to 127 assigned to C−1 to G9.
 */
export type Note = number;

export enum MidiCommand {
	NOTE_ON = 0,
	NOTE_OFF = 1,
}

/**
 * Simplified version of a MIDI message with fixed velocity.
 */
export interface MidiMessage {
	readonly command: MidiCommand;
	readonly note: Note;
}

export type MidiMessageHandler = (message: MidiMessage) => void;
