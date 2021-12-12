let ctx: AudioContext | null = null;
let masterGainNode: GainNode | null = null;

// Lazy init on interactive usage because otherwise chrome blocks ctx creation.
export const getAudioCtx = (): [AudioContext, GainNode] => {
	if (ctx == null || masterGainNode == null) {
		ctx = new AudioContext();
		masterGainNode = new GainNode(ctx);
		masterGainNode.connect(ctx.destination);
	}
	return [ctx, masterGainNode];
};
