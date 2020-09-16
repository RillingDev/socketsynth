import type { MidiEvent } from "./midiEvent";
import { Type } from "./midiEvent";
import { createOsc } from "./audioCtx";
import { getNoteFreq, getNoteString } from "./note";
import { getLogger } from "../logger";

const logger = getLogger("synth");

type MidiEventHandler = (midiEvent: MidiEvent) => void;

export const createSynth: () => {
    handleMidiEvent: MidiEventHandler;
} = () => {
    const active = new Map<string, OscillatorNode>();

    const handleMidiEvent: MidiEventHandler = (midiEvent) => {
        const noteString = getNoteString(midiEvent.note);
        if (midiEvent.type === Type.PRESS) {
            if (active.has(noteString)) {
                logger.warn(`Already playing '${noteString}'.`);
                return;
            }

            const osc = createOsc();

            osc.frequency.value = getNoteFreq(midiEvent.note);

            active.set(noteString, osc);
            logger.debug(`Start playing' ${noteString}'.`);
            osc.start();
        } else {
            if (!active.has(noteString)) {
                logger.info(
                    `Could not find osc for '${noteString}', skipping.`
                );
                return;
            }
            const osc = active.get(noteString)!;
            logger.debug(`Stop playing '${noteString}'.`);
            active.delete(noteString);
            osc.stop();
        }
    };

    return { handleMidiEvent };
};
