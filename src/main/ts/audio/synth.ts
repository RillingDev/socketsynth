import type { MidiMessageHandler } from "../midi/midiMessage";
import { MidiCommand } from "../midi/midiMessage";
import { getLogger } from "../logger";
import { getAudioCtx } from "./audioCtx";
import type { OscFactory } from "./oscFactory";
import { getFrequencyForNote, getStringForNote } from "./note";

const logger = getLogger("synth");

const createOsc = (oscFactory: OscFactory): OscillatorNode => {
	const [audioCtx, gainNode] = getAudioCtx();
	const [oscNode, outputNode] = oscFactory(audioCtx);
	outputNode.connect(gainNode);
	return oscNode;
};

export interface Synth {
	readonly handleMidiMessage: MidiMessageHandler;
}

export const createSynth = (oscFactory: OscFactory): Synth => {
	const active = new Map<string, OscillatorNode>();

	const handleMidiMessage: MidiMessageHandler = (message) => {
		const noteString = getStringForNote(message.note);
		if (message.command === MidiCommand.NOTE_ON) {
			if (active.has(noteString)) {
				logger.warn(`Already playing '${noteString}'.`);
				return;
			}

			const osc = createOsc(oscFactory);
			osc.frequency.value = getFrequencyForNote(message.note);

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

	return { handleMidiMessage };
};
export { createOsc };
