import { getLogger } from "./logger";
import { createStompClient } from "./messaging/stompClient";
import { createSynth } from "./audio/synth";
import { createPianoComponent } from "./dom/piano";
import {
	bassOscFactory,
	leadOscFactory,
	sineOscFactory,
} from "./audio/oscFactory";
import { createDelegatingMidiChannelMessageClient } from "./messaging/midiChannelMessageClient";
import { bindKeyboardKeyEvents } from "./dom/keyboardKeyMapping";
import type { MidiMessage } from "./midi/midiMessage";
import type { MidiChannelMessage } from "./midi/midiChannelMessage";

const logger = getLogger("main");

const pianoContainer1 = document.getElementById("piano1")!;
const pianoContainer2 = document.getElementById("piano2")!;
const pianoContainer3 = document.getElementById("piano3")!;
const keyboardChannelSelect = document.getElementById(
	"keyboardChannel"
) as HTMLSelectElement;

const synth1 = createSynth(sineOscFactory);
const synth2 = createSynth(leadOscFactory);
const synth3 = createSynth(bassOscFactory);

const extractMidiChannelMessage = (
	channelMessage: MidiChannelMessage
): [number, MidiMessage] => {
	return [
		channelMessage.channel,
		{
			command: channelMessage.command,
			note: channelMessage.note,
		},
	];
};

const createMidiChannelMessage = (
	channel: number,
	message: MidiMessage
): MidiChannelMessage => {
	return {
		command: message.command,
		note: message.note,
		channel,
	};
};

createStompClient(`wss://${location.host}${location.pathname}ws`)
	.then((rawClient) => {
		logger.info("Connected.", rawClient);
		const client = createDelegatingMidiChannelMessageClient(rawClient);

		const piano1 = createPianoComponent(pianoContainer1, (message) =>
			client.publish(createMidiChannelMessage(1, message))
		);
		client.subscribe((message) => {
			if (message.channel == 1) {
				const [, event] = extractMidiChannelMessage(message);
				synth1.handleMidiMessage(event);
				piano1.markPlayingStatus(event);
			}
		});

		const piano2 = createPianoComponent(pianoContainer2, (message) =>
			client.publish(createMidiChannelMessage(2, message))
		);
		client.subscribe((message) => {
			if (message.channel == 2) {
				const [, event] = extractMidiChannelMessage(message);
				synth2.handleMidiMessage(event);
				piano2.markPlayingStatus(event);
			}
		});

		const piano3 = createPianoComponent(pianoContainer3, (message) =>
			client.publish(createMidiChannelMessage(3, message))
		);

		client.subscribe((channelMessage) => {
			if (channelMessage.channel == 3) {
				const [, message] = extractMidiChannelMessage(channelMessage);
				synth3.handleMidiMessage(message);
				piano3.markPlayingStatus(message);
			}
		});

		bindKeyboardKeyEvents(document.body, (message) => {
			if (keyboardChannelSelect.value === "") {
				return;
			}
			const channel = Number(keyboardChannelSelect.value);
			if (Number.isNaN(channel)) {
				return;
			}
			client.publish(createMidiChannelMessage(channel, message));
		});

		logger.info("Bound all synths.");
	})
	.catch((e) => logger.error("Received error.", e));
