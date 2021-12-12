import type { MidiEventHandler } from "./midiEvent";
import { Type } from "./midiEvent";
import { getKeyFreq, getKeyString } from "./key";
import { getLogger } from "../logger";
import { getAudioCtx } from "./audioCtx";
import type { OscFactory } from "./oscFactory";

const logger = getLogger("synth");

const createOsc = (oscFactory: OscFactory): OscillatorNode => {
	const [audioCtx, gainNode] = getAudioCtx();
	const [oscNode, outputNode] = oscFactory(audioCtx);
	outputNode.connect(gainNode);
	return oscNode;
};

export interface Synth {
	readonly handleMidiEvent: MidiEventHandler;
}

export const createSynth = (oscFactory: OscFactory): Synth => {
	const active = new Map<string, OscillatorNode>();

	const handleMidiEvent: MidiEventHandler = (midiEvent) => {
		const keyString = getKeyString(midiEvent.key);
		if (midiEvent.type === Type.PRESS) {
			if (active.has(keyString)) {
				logger.warn(`Already playing '${keyString}'.`);
				return;
			}

			const osc = createOsc(oscFactory);
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
