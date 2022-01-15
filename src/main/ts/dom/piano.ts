import type {
	MidiMessage,
	MidiMessageHandler,
	Note,
} from "../midi/midiMessage";
import { MidiCommand } from "../midi/midiMessage";
import { getNote, getStringForNote, TONES_RELATIVE_TO_C } from "../audio/note";

interface PianoKey {
	readonly element: HTMLElement;
	readonly markPlayingStatus: (type: MidiCommand) => void;
}

const createPianoKeyComponent = (
	note: Note,
	midiMessageHandler: MidiMessageHandler
): PianoKey => {
	const element = document.createElement("button");
	element.textContent = getStringForNote(note);

	const pressEventHandler = (): void =>
		midiMessageHandler({
			note,
			command: MidiCommand.NOTE_ON,
		});
	const releaseEventHandler = (): void => {
		if (element.dataset["playing"] === "true") {
			midiMessageHandler({
				note,
				command: MidiCommand.NOTE_OFF,
			});
		}
	};
	element.addEventListener("mousedown", pressEventHandler);
	element.addEventListener("mouseup", releaseEventHandler);
	element.addEventListener("mouseout", releaseEventHandler);

	const markPlayingStatus = (type: MidiCommand): void => {
		if (type === MidiCommand.NOTE_ON) {
			element.dataset["playing"] = "true";
		} else {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete element.dataset["playing"];
		}
	};

	return { element, markPlayingStatus };
};

interface Piano {
	readonly markPlayingStatus: (midiMessage: MidiMessage) => void;
}

const STARTING_OCTAVE = 2;
const ENDING_OCTAVE = 6;
export const createPianoComponent = (
	container: HTMLElement,
	midiMessageHandler: MidiMessageHandler
): Piano => {
	const keys: Map<string, PianoKey> = new Map<string, PianoKey>();

	for (let octave = STARTING_OCTAVE; octave <= ENDING_OCTAVE; octave++) {
		for (const tone of TONES_RELATIVE_TO_C) {
			const note = getNote(tone, octave);
			const pianoKey = createPianoKeyComponent(note, midiMessageHandler);
			pianoKey.element.classList.add("piano__key");
			keys.set(getStringForNote(note), pianoKey);
		}
	}

	container.classList.add("piano");
	const keyElements = Array.from(keys.values()).map(
		(pianoKey) => pianoKey.element
	);
	container.append(...keyElements);

	const markPlayingStatus = (midiMessage: MidiMessage): void => {
		const noteString = getStringForNote(midiMessage.note);
		if (!keys.has(noteString)) {
			throw new Error(
				`Could not find key element for key '${noteString}'.`
			);
		}
		keys.get(noteString)!.markPlayingStatus(midiMessage.command);
	};

	return {
		markPlayingStatus,
	};
};
