import { createReverbNode } from "./effects";

export type OscFactory = (
	audioCtx: AudioContext
) => [OscillatorNode, AudioNode];

export const sineOscFactory: OscFactory = (audioCtx: AudioContext) => {
	const oscNode = new OscillatorNode(audioCtx, { type: "sine" });

	return [oscNode, oscNode];
};

export const leadOscFactory: OscFactory = (audioCtx: AudioContext) => {
	const oscNode = new OscillatorNode(audioCtx, { type: "sawtooth" });

	const reverb = createReverbNode(audioCtx, 0.5, 0.275, 800);

	const intermediateGain = new GainNode(audioCtx, { gain: 0.8 });

	const outputNode = oscNode.connect(reverb).connect(intermediateGain);
	return [oscNode, outputNode];
};

export const bassOscFactory: OscFactory = (audioCtx: AudioContext) => {
	const oscNode = new OscillatorNode(audioCtx, { type: "square" });

	const compressor = new DynamicsCompressorNode(audioCtx, {
		threshold: -50,
		ratio: 40,
		attack: 0,
		release: 0.25,
	});

	const makeupGain = new GainNode(audioCtx, { gain: 4.5 });

	const outputNode = oscNode.connect(compressor).connect(makeupGain);
	return [oscNode, outputNode];
};
