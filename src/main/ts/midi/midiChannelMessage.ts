import type { MidiMessage } from "./midiMessage";

/**
 * Simplified version of a MIDI channel message with fixed velocity.
 */
export interface MidiChannelMessage extends MidiMessage {
	readonly channel: number;
}
