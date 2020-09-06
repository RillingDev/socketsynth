import type { MidiEvent } from "./midiEvent";
import { createOsc } from "./ctx";
import { getNote } from "./notes";
import { getLogger } from "../logger";

const logger = getLogger("Synth");

export type ReleaseCallback = () => void;

export const pressKey = (midiEvent: MidiEvent): ReleaseCallback => {
    const osc = createOsc();

    const note = getNote(midiEvent);
    if (note == null) {
        logger.warn(`Could not find note for ${JSON.stringify(midiEvent)}.`);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => {};
    }

    osc.frequency.value = note;

    logger.debug(`Start playing ${JSON.stringify(midiEvent)}.`);
    osc.start();
    return () => {
        logger.debug(`Stop playing ${JSON.stringify(midiEvent)}.`);
        osc.stop();
    };
};
