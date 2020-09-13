import { getLogger } from "./logger";
import { createClient, wrapAsJsonClient } from "./messaging/ws";
import type { MidiEvent } from "./audio/midiEvent";
import { createSynth } from "./audio/synth";
import { createKeyboard } from "./dom/keyboard";

const logger = getLogger("main");

const { handleMidiEvent } = createSynth();

const keyboardContainer = document.getElementById("keyboard")!;

createClient(`wss://${location.host}${location.pathname}ws`)
    .then((client) => {
        logger.info("Connected.", client);
        const jsonClient = wrapAsJsonClient<MidiEvent>(client);

        createKeyboard(keyboardContainer, (midiEvent) => {
            jsonClient.publish("/app/midi/input", midiEvent);
        });

        jsonClient.subscribe("/topic/midi/output", (midiEvent) => {
            handleMidiEvent(midiEvent);
        });
    })
    .catch((e) => logger.error("Received error.", e));
