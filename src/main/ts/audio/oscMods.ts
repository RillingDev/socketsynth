import type { OscModifier } from "./synth";

export const sineOscMod: OscModifier = (
    osc: OscillatorNode,
    _audioCtx: AudioContext,
    gainNode: GainNode
) => {
    osc.type = "sine";

    osc.connect(gainNode);
};

// Based on https://itnext.io/algorithmic-reverb-and-web-audio-api-e1ccec94621a
const createReverbNode = (
    audioCtx: AudioContext,
    delayTime: number,
    delayWet: number,
    lpCutoff: number
): AudioNode => {
    const delay = new DelayNode(audioCtx, { delayTime: delayTime });

    const lowPass = new BiquadFilterNode(audioCtx, {
        type: "lowpass",
        frequency: lpCutoff,
    });

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(delayWet, audioCtx.currentTime);

    const node = audioCtx.createGain();
    node.connect(delay).connect(lowPass).connect(gain).connect(node);
    return node;
};

export const leadOscMod: OscModifier = (osc, audioCtx, gainNode) => {
    osc.type = "sawtooth";

    const reverb = createReverbNode(audioCtx, 0.5, 0.275, 800);

    const intermediateGain = audioCtx.createGain();
    intermediateGain.gain.value = 0.85;

    osc.connect(reverb).connect(intermediateGain).connect(gainNode);
};

export const bassOscMod: OscModifier = (osc, audioCtx, gainNode) => {
    osc.type = "square";

    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.ratio.value = 40;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;

    const makeupGain = audioCtx.createGain();
    makeupGain.gain.value = 4.5;

    osc.connect(compressor);
    compressor.connect(makeupGain);
    makeupGain.connect(gainNode);
};
