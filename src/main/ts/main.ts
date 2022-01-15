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
import "../scss/main.scss";

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

createStompClient(`wss://${location.host}${location.pathname}ws`)
	.then((rawClient) => {
		logger.info("Connected.", rawClient);
		const client = createDelegatingMidiChannelMessageClient(rawClient);

		const piano1 = createPianoComponent(pianoContainer1, (message) =>
			client.publish({
				...message,
				channel: 1,
			})
		);
		client.subscribe((channelMessage) => {
			if (channelMessage.channel == 1) {
				synth1.handleMidiMessage(channelMessage);
				piano1.markPlayingStatus(channelMessage);
			}
		});

		const piano2 = createPianoComponent(pianoContainer2, (message) =>
			client.publish({
				...message,
				channel: 2,
			})
		);
		client.subscribe((channelMessage) => {
			if (channelMessage.channel == 2) {
				synth2.handleMidiMessage(channelMessage);
				piano2.markPlayingStatus(channelMessage);
			}
		});

		const piano3 = createPianoComponent(pianoContainer3, (message) =>
			client.publish({
				...message,
				channel: 3,
			})
		);
		client.subscribe((channelMessage) => {
			if (channelMessage.channel == 3) {
				synth3.handleMidiMessage(channelMessage);
				piano3.markPlayingStatus(channelMessage);
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
			client.publish({
				...message,
				channel,
			});
		});

		logger.info("Bound all synths.");
	})
	.catch((e) => logger.error("Received error.", e));
