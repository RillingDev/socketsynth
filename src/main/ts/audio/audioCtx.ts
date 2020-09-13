const audioContext = new AudioContext();

const masterGainNode = audioContext.createGain();
masterGainNode.connect(audioContext.destination);

const createOsc = (): OscillatorNode => {
    const osc = audioContext.createOscillator();
    osc.connect(masterGainNode);
    return osc;
};

export { createOsc };
