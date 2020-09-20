import { createReverbNode } from "./effects";

export type OscFactory = (
    audioCtx: AudioContext
) => [OscillatorNode, AudioNode];

export const sineOscFactory: OscFactory = (audioCtx: AudioContext) => {
    const oscNode = audioCtx.createOscillator();
    oscNode.type = "sine";

    return [oscNode, oscNode];
};

export const leadOscFactory: OscFactory = (audioCtx: AudioContext) => {
    const oscNode = audioCtx.createOscillator();
    oscNode.type = "sawtooth";

    const reverb = createReverbNode(audioCtx, 0.5, 0.275, 800);

    const intermediateGain = audioCtx.createGain();
    intermediateGain.gain.value = 0.8;

    const outputNode = oscNode.connect(reverb).connect(intermediateGain);
    return [oscNode, outputNode];
};

export const bassOscFactory: OscFactory = (audioCtx: AudioContext) => {
    const oscNode = audioCtx.createOscillator();
    oscNode.type = "square";

    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.ratio.value = 40;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;

    const makeupGain = audioCtx.createGain();
    makeupGain.gain.value = 4.5;

    const outputNode = oscNode.connect(compressor).connect(makeupGain);
    return [oscNode, outputNode];
};
