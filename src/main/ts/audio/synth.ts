import type { MidiEvent } from "./midiEvent";
import { Type } from "./midiEvent";
import { getNoteFreq, getNoteString } from "./note";
import { getLogger } from "../logger";
import { getAudioCtx } from "./audioCtx";

const logger = getLogger("synth");

export type OscModifier = (
    osc: OscillatorNode,
    audioCtx: AudioContext,
    gainNode: GainNode
) => void;

const createOsc = (mod: OscModifier): OscillatorNode => {
    const [audioCtx, gainNode] = getAudioCtx();
    const osc = audioCtx.createOscillator();
    mod(osc, audioCtx, gainNode);
    return osc;
};

type MidiEventHandler = (midiEvent: MidiEvent) => void;

export interface Synth {
    readonly handleMidiEvent: MidiEventHandler;
}

export const createSynth = (oscMod: OscModifier): Synth => {
    const active = new Map<string, OscillatorNode>();

    const handleMidiEvent: MidiEventHandler = (midiEvent) => {
        const noteString = getNoteString(midiEvent.note);
        if (midiEvent.type === Type.PRESS) {
            if (active.has(noteString)) {
                logger.warn(`Already playing '${noteString}'.`);
                return;
            }

            const osc = createOsc(oscMod);
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
export { createOsc };
