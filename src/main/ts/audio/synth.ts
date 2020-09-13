import type { MidiEvent } from "./midiEvent";
import { Type } from "./midiEvent";
import { createOsc } from "./audioCtx";
import { getNoteFreq, getNoteString } from "./note";
import { getLogger } from "../logger";

const logger = getLogger("Synth");

type MidiEventHandler = (midiEvent: MidiEvent) => void;

export const createSynth: () => {
    handleMidiEvent: MidiEventHandler;
} = () => {
    const active = new Map<string, OscillatorNode>();

    const handleMidiEvent: MidiEventHandler = (midiEvent) => {
        const noteString = getNoteString(midiEvent.note);
        if (midiEvent.type === Type.PRESS) {
            if (active.has(noteString)) {
                logger.warn(`Already playing ${noteString}.`);
                return;
            }

            const osc = createOsc();

            const noteFreq = getNoteFreq(midiEvent.note);
            if (noteFreq == null) {
                logger.warn(
                    `Could not find note for ${JSON.stringify(midiEvent)}.`
                );
                return;
            }

            osc.frequency.value = noteFreq;

            active.set(noteString, osc);
            logger.debug(`Start playing ${JSON.stringify(midiEvent)}.`);
            osc.start();
        } else {
            if (!active.has(noteString)) {
                logger.warn(`Could not find osc for ${noteString}.`);
                return;
            }
            const osc = active.get(noteString)!;
            logger.debug(`Stop playing ${JSON.stringify(midiEvent)}.`);
            active.delete(noteString);
            osc.stop();
        }
    };

    return { handleMidiEvent };
};
