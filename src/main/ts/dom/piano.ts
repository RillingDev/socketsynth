import type { MidiEvent, MidiEventHandler } from "../audio/midiEvent";
import { Type } from "../audio/midiEvent";
import type { Key } from "../audio/key";
import { getKeyString, TONES } from "../audio/key";

interface PianoKey {
	readonly element: HTMLElement;
	readonly markPlayingStatus: (type: Type) => void;
}

const createPianoKeyComponent = (
	key: Key,
	midiEventHandler: MidiEventHandler
): PianoKey => {
	const element = document.createElement("button");
	element.textContent = getKeyString(key);

	const pressEventHandler = (): void =>
		midiEventHandler({
			key,
			type: Type.PRESS,
		});
	const releaseEventHandler = (): void => {
		if (element.dataset["playing"] === "true") {
			midiEventHandler({
				key,
				type: Type.RELEASE,
			});
		}
	};
	element.addEventListener("mousedown", pressEventHandler);
	element.addEventListener("mouseup", releaseEventHandler);
	element.addEventListener("mouseout", releaseEventHandler);

	const markPlayingStatus = (type: Type): void => {
		if (type === Type.PRESS) {
			element.dataset["playing"] = "true";
		} else {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete element.dataset["playing"];
		}
	};

	return { element, markPlayingStatus };
};

interface Piano {
	readonly markPlayingStatus: (midiEvent: MidiEvent) => void;
}

const STARTING_OCTAVE = 2;
const ENDING_OCTAVE = 6;
export const createPianoComponent = (
	container: HTMLElement,
	midiEventHandler: MidiEventHandler
): Piano => {
	const keys: Map<string, PianoKey> = new Map<string, PianoKey>();

	for (let octave = STARTING_OCTAVE; octave <= ENDING_OCTAVE; octave++) {
		for (const tone of TONES) {
			const key = { tone, octave };
			const pianoKey = createPianoKeyComponent(key, midiEventHandler);
			pianoKey.element.classList.add("piano__key");
			keys.set(getKeyString(key), pianoKey);
		}
	}

	container.classList.add("piano");
	const keyElements = Array.from(keys.values()).map(
		(pianoKey) => pianoKey.element
	);
	container.append(...keyElements);

	const markPlayingStatus = (midiEvent: MidiEvent): void => {
		const keyString = getKeyString(midiEvent.key);
		if (!keys.has(keyString)) {
			throw new Error(
				`Could not find key element for key '${keyString}'.`
			);
		}
		keys.get(keyString)!.markPlayingStatus(midiEvent.type);
	};

	return {
		markPlayingStatus,
	};
};
