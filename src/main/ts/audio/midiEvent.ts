import type { Key } from "./key";
import type { MidiCommand } from "../messaging/midiChannelMessage";

export interface MidiEvent {
	readonly command: MidiCommand;
	readonly key: Key;
}

export type MidiEventHandler = (midiEvent: MidiEvent) => void;
