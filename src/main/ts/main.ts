import { getLogger } from "./logger";
import { createStompClient } from "./messaging/stompClient";
import type { Synth } from "./audio/synth";
import { createSynth } from "./audio/synth";
import { createPianoComponent } from "./dom/piano";
import {
    bassOscFactory,
    leadOscFactory,
    sineOscFactory,
} from "./audio/oscFactory";
import type { MidiEventClient } from "./messaging/midiEventClient";
import { createDelegatingMidiEventClient } from "./messaging/midiEventClient";

const logger = getLogger("main");

const pianoContainer1 = document.getElementById("piano1")!;
const pianoContainer2 = document.getElementById("piano2")!;
const pianoContainer3 = document.getElementById("piano3")!;

const synth1 = createSynth(sineOscFactory);
const synth2 = createSynth(leadOscFactory);
const synth3 = createSynth(bassOscFactory);

const bindSocketSynth = (
    client: MidiEventClient,
    channel: number,
    synth: Synth,
    pianoContainer: HTMLElement
): void => {
    const piano = createPianoComponent(pianoContainer, (midiEvent) =>
        client.publish(channel, midiEvent)
    );

    client.subscribe(channel, (midiEvent) => {
        synth.handleMidiEvent(midiEvent);
        piano.markPlayingStatus(midiEvent);
    });
};

createStompClient(`wss://${location.host}${location.pathname}ws`)
    .then((rawClient) => {
        logger.info("Connected.", rawClient);
        const client = createDelegatingMidiEventClient(rawClient);

        bindSocketSynth(client, 1, synth1, pianoContainer1);
        bindSocketSynth(client, 2, synth2, pianoContainer2);
        bindSocketSynth(client, 3, synth3, pianoContainer3);

        logger.info("Bound all synths.");
    })
    .catch((e) => logger.error("Received error.", e));
