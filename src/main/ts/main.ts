import { getLogger } from "./logger";
import { createStompClient } from "./messaging/stompClient";
import type { Synth } from "./audio/synth";
import { createSynth } from "./audio/synth";
import { createKeyboardComponent } from "./dom/keyboard";
import { bassOscMod, leadOscMod, sineOscMod } from "./audio/oscMods";
import type { MidiEventClient } from "./messaging/midiEventClient";
import { createDelegatingMidiEventClient } from "./messaging/midiEventClient";

const logger = getLogger("main");

const bindSocketSynth = (
    client: MidiEventClient,
    channel: number,
    synth: Synth,
    keyboardContainer: HTMLElement,
    startingOctave: number,
    endingOctave: number
): void => {
    const keyboard = createKeyboardComponent(
        keyboardContainer,
        startingOctave,
        endingOctave,
        (midiEvent) => client.publish(channel, midiEvent)
    );

    client.subscribe(channel, (midiEvent) => {
        synth.handleMidiEvent(midiEvent);
        keyboard.markPlayingStatus(midiEvent);
    });
};

createStompClient(`wss://${location.host}${location.pathname}ws`)
    .then((rawClient) => {
        logger.info("Connected.", rawClient);
        const client = createDelegatingMidiEventClient(rawClient);

        bindSocketSynth(
            client,
            1,
            createSynth(sineOscMod),
            document.getElementById("keyboard1")!,
            2,
            6
        );
        bindSocketSynth(
            client,
            2,
            createSynth(leadOscMod),
            document.getElementById("keyboard2")!,
            4,
            6
        );
        bindSocketSynth(
            client,
            3,
            createSynth(bassOscMod),
            document.getElementById("keyboard3")!,
            1,
            3
        );

        logger.info("Bound all synths.");
    })
    .catch((e) => logger.error("Received error.", e));
