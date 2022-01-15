import type { MidiMessageHandler, Note } from "../midi/midiMessage";
import { MidiCommand } from "../midi/midiMessage";
import { getNote } from "../audio/note";

const qwertyKeyboardKeyMap = new Map<string, Note>([
	["1", getNote("C", 5)],
	["2", getNote("C#", 5)],
	["3", getNote("D", 5)],
	["4", getNote("D#", 5)],
	["5", getNote("E", 5)],
	["6", getNote("F", 5)],
	["7", getNote("F#", 5)],
	["8", getNote("G", 5)],
	["9", getNote("G#", 5)],
	["0", getNote("A", 5)],
	["-", getNote("A#", 5)],
	["=", getNote("B", 5)],

	["q", getNote("C", 4)],
	["w", getNote("C#", 4)],
	["e", getNote("D", 4)],
	["r", getNote("D#", 4)],
	["t", getNote("E", 4)],
	["y", getNote("F", 4)],
	["u", getNote("F#", 4)],
	["i", getNote("G", 4)],
	["o", getNote("G#", 4)],
	["p", getNote("A", 4)],
	["[", getNote("A#", 4)],
	["]", getNote("B", 4)],

	["a", getNote("C", 3)],
	["s", getNote("C#", 3)],
	["d", getNote("D", 3)],
	["f", getNote("D#", 3)],
	["g", getNote("E", 3)],
	["h", getNote("F", 3)],
	["j", getNote("F#", 3)],
	["k", getNote("G", 3)],
	["l", getNote("G#", 3)],
	[";", getNote("A", 3)],
	// These *could* be bound, but browsers usually bind them to something else.
	// ["'", getNoteForKey("A#", 3)],
	// ["enter", getNoteForKey("B", 3)],

	["z", getNote("C", 2)],
	["x", getNote("C#", 2)],
	["c", getNote("D", 2)],
	["v", getNote("D#", 2)],
	["b", getNote("E", 2)],
	["n", getNote("F", 2)],
	["m", getNote("F#", 2)],
	[",", getNote("G", 2)],
	[".", getNote("G#", 2)],
	// These *could* be bound, but browsers usually bind them to something else.
	// ["/", getNoteForKey("A", 2)],
	// ["\\", getNoteForKey("A#", 2)],
	// ["`", getNoteForKey("A", 2)],
]);

export const bindKeyboardKeyEvents = (
	container: HTMLElement,
	midiMessageHandler: MidiMessageHandler
): void => {
	const handleKeyEvent = (
		keyboardKey: string,
		command: MidiCommand
	): void => {
		keyboardKey = keyboardKey.toLowerCase();
		if (!qwertyKeyboardKeyMap.has(keyboardKey)) {
			return;
		}
		const note = qwertyKeyboardKeyMap.get(keyboardKey)!;
		midiMessageHandler({ command, note });
	};
	container.addEventListener("keydown", (e) =>
		handleKeyEvent(e.key, MidiCommand.NOTE_ON)
	);
	container.addEventListener("keyup", (e) =>
		handleKeyEvent(e.key, MidiCommand.NOTE_OFF)
	);
};
