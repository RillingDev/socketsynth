import type { MidiEvent } from "./midiEvent";
import { Type } from "./midiEvent";
import { getKeyFreq, getKeyString } from "./key";
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
        const keyString = getKeyString(midiEvent.key);
        if (midiEvent.type === Type.PRESS) {
            if (active.has(keyString)) {
                logger.warn(`Already playing '${keyString}'.`);
                return;
            }

            const osc = createOsc(oscMod);
            osc.frequency.value = getKeyFreq(midiEvent.key);

            active.set(keyString, osc);
            logger.debug(`Start playing' ${keyString}'.`);
            osc.start();
        } else {
            if (!active.has(keyString)) {
                logger.info(`Could not find osc for '${keyString}', skipping.`);
                return;
            }
            const osc = active.get(keyString)!;
            logger.debug(`Stop playing '${keyString}'.`);
            active.delete(keyString);
            osc.stop();
        }
    };

    return { handleMidiEvent };
};
export { createOsc };
