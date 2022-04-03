import type { MidiMessage } from "./midiMessage";

/**
 * A simplified version of a MIDI channel message with fixed velocity.
 */
export interface MidiChannelMessage extends MidiMessage {
	readonly channel: number;
}
