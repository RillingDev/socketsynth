// Based on https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Simple_synth

const audioContext = new AudioContext();

const masterGainNode = audioContext.createGain();
masterGainNode.connect(audioContext.destination);

const createOsc = (): OscillatorNode => {
    const osc = audioContext.createOscillator();
    osc.connect(masterGainNode);
    return osc;
};

export { createOsc };
