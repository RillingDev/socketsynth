// Based on https://itnext.io/algorithmic-reverb-and-web-audio-api-e1ccec94621a
export const createReverbNode = (
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

	const gain = new GainNode(audioCtx);
	gain.gain.setValueAtTime(delayWet, audioCtx.currentTime);

	const node = new GainNode(audioCtx);
	node.connect(delay).connect(lowPass).connect(gain).connect(node);
	return node;
};
