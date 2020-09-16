import { getLogger } from "./logger";
import { createStompClient } from "./messaging/stompClient";
import type { OscModifier } from "./audio/synth";
import { createSynth } from "./audio/synth";
import { createKeyboardComponent } from "./dom/keyboard";
import { bassOscMod, leadOscMod, sineOscMod } from "./audio/oscMods";
import type { MidiEventClient } from "./messaging/midiEventClient";
import { createDelegatingMidiEventClient } from "./messaging/midiEventClient";

const logger = getLogger("main");

const bindSocketSynth = (
    client: MidiEventClient,
    keyboardContainer: HTMLElement,
    channel: number,
    oscMod: OscModifier,
    startingOctave: number,
    endingOctave: number
): void => {
    const synth = createSynth(oscMod);
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

const keyboard1Container = document.getElementById("keyboard1")!;
const keyboard2Container = document.getElementById("keyboard2")!;
const keyboard3Container = document.getElementById("keyboard3")!;

createStompClient(`wss://${location.host}${location.pathname}ws`)
    .then((rawClient) => {
        logger.info("Connected.", rawClient);
        const client = createDelegatingMidiEventClient(rawClient);
        bindSocketSynth(client, keyboard1Container, 1, sineOscMod, 2, 6);
        bindSocketSynth(client, keyboard2Container, 2, leadOscMod, 4, 6);
        bindSocketSynth(client, keyboard3Container, 3, bassOscMod, 1, 3);
    })
    .catch((e) => logger.error("Received error.", e));
