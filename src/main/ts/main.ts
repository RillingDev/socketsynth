import { getLogger } from "./logger";
import { createStompClient } from "./messaging/stompClient";
import { createSynth } from "./audio/synth";
import { createPianoComponent } from "./dom/piano";
import {
	bassOscFactory,
	leadOscFactory,
	sineOscFactory,
} from "./audio/oscFactory";
import { createDelegatingMidiEventClient } from "./messaging/midiChannelMessageClient";
import { bindKeyboardKeyEvents } from "./dom/keyboardKeyMapping";
import type { MidiEvent } from "./audio/midiEvent";
import { TONES } from "./audio/key";
import type { MidiChannelMessage } from "./messaging/midiChannelMessage";

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

const midiMessageToEvent = (
	midiChannelMessage: MidiChannelMessage
): [number, MidiEvent] => {
	const toneNum = midiChannelMessage.note % 12;
	const tone = TONES[toneNum];
	const octave = (midiChannelMessage.note - toneNum - 12) / 12;
	const midi = {
		command: midiChannelMessage.command,
		key: {
			octave,
			tone,
		},
	};
	return [midiChannelMessage.channel, midi];
};

const midiEventToMessage = (
	channel: number,
	data: MidiEvent
): MidiChannelMessage => {
	const note = 12 + data.key.octave * 12 + TONES.indexOf(data.key.tone);
	return {
		command: data.command,
		channel,
		note,
	};
};

createStompClient(`wss://${location.host}${location.pathname}ws`)
	.then((rawClient) => {
		logger.info("Connected.", rawClient);
		const client = createDelegatingMidiEventClient(rawClient);

		const piano1 = createPianoComponent(pianoContainer1, (midiEvent) =>
			client.publish(midiEventToMessage(1, midiEvent))
		);
		client.subscribe((message) => {
			if (message.channel == 1) {
				const [, event] = midiMessageToEvent(message);
				synth1.handleMidiEvent(event);
				piano1.markPlayingStatus(event);
			}
		});

		const piano2 = createPianoComponent(pianoContainer2, (midiEvent) =>
			client.publish(midiEventToMessage(2, midiEvent))
		);
		client.subscribe((message) => {
			if (message.channel == 2) {
				const [, event] = midiMessageToEvent(message);
				synth2.handleMidiEvent(event);
				piano2.markPlayingStatus(event);
			}
		});

		const piano3 = createPianoComponent(pianoContainer3, (midiEvent) =>
			client.publish(midiEventToMessage(3, midiEvent))
		);

		client.subscribe((message) => {
			if (message.channel == 3) {
				const [, event] = midiMessageToEvent(message);
				synth3.handleMidiEvent(event);
				piano3.markPlayingStatus(event);
			}
		});

		bindKeyboardKeyEvents(document.body, (midiEvent) => {
			if (keyboardChannelSelect.value === "") {
				return;
			}
			const channel = Number(keyboardChannelSelect.value);
			if (Number.isNaN(channel)) {
				return;
			}
			client.publish(midiEventToMessage(channel, midiEvent));
		});

		logger.info("Bound all synths.");
	})
	.catch((e) => logger.error("Received error.", e));
