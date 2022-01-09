import type { Client } from "@stomp/stompjs";
import { getLogger } from "../logger";
import type { Midi } from "../audio/midi";
import { MidiCommand } from "../audio/midi";
import { TONES } from "../audio/key";

interface MidiChannelMessage {
	readonly command: MidiCommand;
	readonly channel: number;
	readonly note: number;
}

// https://en.wikipedia.org/wiki/MIDI#Technical_specifications#Technical specifications

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

export interface MidiEventClient {
	readonly publish: (channel: number, data: Midi) => void;
	readonly subscribe: (
		channel: number,
		callback: (data: Midi) => void
	) => void;
}

const midiMessageToEvent = (midiChannelMessage: MidiChannelMessage): Midi => {
	const toneNum = midiChannelMessage.note % 12;
	const tone = TONES[toneNum];
	const octave = (midiChannelMessage.note - toneNum - 12) / 12;
	return {
		command: midiChannelMessage.command,
		key: {
			octave,
			tone,
		},
	};
};

const midiEventToMessage = (
	data: Midi,
	channel: number
): MidiChannelMessage => {
	const note = 12 + data.key.octave * 12 + TONES.indexOf(data.key.tone);
	return {
		command: data.command,
		channel,
		note,
	};
};

export const createDelegatingMidiEventClient = (
	client: Client
): MidiEventClient => {
	const logger = getLogger("DelegatingMidiEventClient");
	return {
		publish: (channel: number, data: Midi) => {
			const midiChannelMessage = midiEventToMessage(data, channel);
			logger.debug(
				`Publishing on '${channel}': ${JSON.stringify(
					midiChannelMessage
				)}.`
			);
			client.publish({
				destination: "/app/midi/input",
				binaryBody: serializeMidi(midiChannelMessage),
			});
		},
		subscribe: (channel: number, callback: (data: Midi) => void) => {
			logger.debug(`Listening on '${channel}'.`);
			client.subscribe("/topic/midi/output", (frame) => {
				const midiChannelMessage = deserializeMidi(frame.binaryBody);
				if (midiChannelMessage.channel == channel) {
					logger.debug(
						`Received event on '${channel}': ${JSON.stringify(
							midiChannelMessage
						)}.`
					);
					const event = midiMessageToEvent(midiChannelMessage);
					callback(event);
				}
			});
		},
	};
};
