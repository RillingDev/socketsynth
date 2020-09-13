let audioContext: AudioContext | null = null;
let masterGainNode: GainNode | null = null;

const createOsc = (): OscillatorNode => {
    // Lazy init on interactive usage because otherwise chrome blocks ctx creation.
    if (audioContext == null || masterGainNode == null) {
        audioContext = new AudioContext();
        masterGainNode = audioContext.createGain();
        masterGainNode.connect(audioContext.destination);
    }

    const osc = audioContext.createOscillator();
    osc.connect(masterGainNode);
    return osc;
};

export { createOsc };
