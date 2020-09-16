let defaultAudioCtx: AudioContext | null = null;
let defaultMasterGainNode: GainNode | null = null;

// Lazy init on interactive usage because otherwise chrome blocks ctx creation.
export const getAudioCtx = (): [AudioContext, GainNode] => {
    if (defaultAudioCtx == null || defaultMasterGainNode == null) {
        defaultAudioCtx = new AudioContext();
        defaultMasterGainNode = defaultAudioCtx.createGain();
        defaultMasterGainNode.connect(defaultAudioCtx.destination);
    }
    return [defaultAudioCtx, defaultMasterGainNode];
};
