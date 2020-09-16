import { getLogger } from "./logger";
import type { JsonClient } from "./messaging/ws";
import { createClient, wrapAsJsonClient } from "./messaging/ws";
import type { MidiEvent } from "./audio/midiEvent";
import { createSynth } from "./audio/synth";
import { createKeyboardComponent } from "./dom/keyboard";
import { sineOscMod } from "./audio/oscMods";

const logger = getLogger("main");

const keyboardContainer = document.getElementById("keyboard")!;

const main = (client: JsonClient<MidiEvent>): void => {
    const synth = createSynth(sineOscMod);
    const keyboard = createKeyboardComponent(
        keyboardContainer,
        2,
        6,
        (midiEvent) => {
            client.publish("/app/midi/input", midiEvent);
        }
    );

    client.subscribe("/topic/midi/output", (midiEvent) => {
        synth.handleMidiEvent(midiEvent);
        keyboard.markPlayingStatus(midiEvent);
    });
};

createClient(`wss://${location.host}${location.pathname}ws`)
    .then((client) => {
        logger.info("Connected.", client);
        main(wrapAsJsonClient<MidiEvent>(client));
    })
    .catch((e) => logger.error("Received error.", e));
