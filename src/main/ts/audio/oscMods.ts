import type { OscModifier } from "./synth";

export const sineOscMod: OscModifier = (
    osc: OscillatorNode,
    _audioCtx: AudioContext,
    gainNode: GainNode
) => {
    osc.type = "sine";

    osc.connect(gainNode);
};

export const leadOscMod: OscModifier = (osc, audioCtx, gainNode) => {
    osc.type = "sawtooth";

    const panner = new PannerNode(audioCtx, {
        panningModel: "HRTF",
        distanceModel: "linear",

        refDistance: 1,
        maxDistance: 10000,
        rolloffFactor: 1,
        coneInnerAngle: 360,
        coneOuterAngle: 0,
        coneOuterGain: 0,

        positionX: 320,
        positionY: 100,
        positionZ: 0,
    });

    osc.connect(panner);
    panner.connect(gainNode);
};

export const bassOscMod: OscModifier = (osc, audioCtx, gainNode) => {
    osc.type = "square";

    const compressor = audioCtx.createDynamicsCompressor();

    osc.connect(compressor);
    compressor.connect(gainNode);
};
