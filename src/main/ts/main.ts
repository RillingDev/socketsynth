import { getLogger } from "./logger";
import { createStompClient } from "./messaging/stompClient";
import { createSynth } from "./audio/synth";
import { createPianoComponent } from "./dom/piano";
import {
    bassOscFactory,
    leadOscFactory,
    sineOscFactory,
} from "./audio/oscFactory";
import { createDelegatingMidiEventClient } from "./messaging/midiEventClient";
import { bindKeyboardKeyEvents } from "./dom/keyboardKeyMapping";

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
        const client = createDelegatingMidiEventClient(rawClient);

        const piano1 = createPianoComponent(pianoContainer1, (midiEvent) =>
            client.publish(1, midiEvent)
        );
        client.subscribe(1, (midiEvent) => {
            synth1.handleMidiEvent(midiEvent);
            piano1.markPlayingStatus(midiEvent);
        });

        const piano2 = createPianoComponent(pianoContainer2, (midiEvent) =>
            client.publish(2, midiEvent)
        );
        client.subscribe(2, (midiEvent) => {
            synth2.handleMidiEvent(midiEvent);
            piano2.markPlayingStatus(midiEvent);
        });

        const piano3 = createPianoComponent(pianoContainer3, (midiEvent) =>
            client.publish(3, midiEvent)
        );

        client.subscribe(3, (midiEvent) => {
            synth3.handleMidiEvent(midiEvent);
            piano3.markPlayingStatus(midiEvent);
        });

        bindKeyboardKeyEvents(document.body, (midiEvent) => {
            if (keyboardChannelSelect.value === "") {
                return;
            }
            const channel = Number(keyboardChannelSelect.value);
            if (Number.isNaN(channel)) {
                return;
            }
            client.publish(channel, midiEvent);
        });

        logger.info("Bound all synths.");
    })
    .catch((e) => logger.error("Received error.", e));
