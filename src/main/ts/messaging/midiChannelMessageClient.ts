import type { Client } from "@stomp/stompjs";
import { getLogger } from "../logger";
import type { MidiChannelMessage } from "./midiChannelMessage";
import { MidiCommand } from "./midiChannelMessage";

// https://en.wikipedia.org/wiki/MIDI#Technical_specifications
const serializeMidi = (midiChannelMessage: MidiChannelMessage): Uint8Array => {
	const velocity = 0b1111111;

	let commandNum: number;
	if (midiChannelMessage.command == MidiCommand.NOTE_ON) {
		commandNum = 0x90;
	} else {
		commandNum = 0x80;
	}

	const status = midiChannelMessage.channel | commandNum;

	return new Uint8Array([status, midiChannelMessage.note, velocity]);
};

const deserializeMidi = (rawMidiMessage: Uint8Array): MidiChannelMessage => {
	if (rawMidiMessage.length != 3) {
		throw new TypeError("Invalid message.");
	}
	const status = rawMidiMessage[0];

	const commandNum = status & 0xf0;
	let command: MidiCommand;
	if (commandNum == 0x90) {
		command = MidiCommand.NOTE_ON;
	} else if (commandNum == 0x80) {
		command = MidiCommand.NOTE_OFF;
	} else {
		throw new TypeError("Unknown type.");
	}

	const channel = status & 0x0f;

	const note = rawMidiMessage[1];

	return {
		command,
		channel,
		note,
	};
};

export interface MidiChannelMessageClient {
	readonly publish: (message: MidiChannelMessage) => void;
	readonly subscribe: (
		callback: (message: MidiChannelMessage) => void
	) => void;
}

export const createDelegatingMidiEventClient = (
	client: Client
): MidiChannelMessageClient => {
	const logger = getLogger("DelegatingMidiEventClient");
	return {
		publish: (message: MidiChannelMessage) => {
			logger.debug(`Publishing: ${JSON.stringify(message)}.`);
			client.publish({
				destination: "/app/midi/input",
				binaryBody: serializeMidi(message),
			});
		},
		subscribe: (callback: (message: MidiChannelMessage) => void) => {
			logger.debug(`Listening.`);
			client.subscribe("/topic/midi/output", (frame) => {
				const message = deserializeMidi(frame.binaryBody);
				logger.debug(`Received: ${JSON.stringify(message)}.`);
				callback(message);
			});
		},
	};
};
