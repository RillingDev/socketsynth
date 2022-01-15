import type { MidiEventHandler } from "../audio/midiEvent";
import type { Key } from "../audio/key";
import { MidiCommand } from "../messaging/midiChannelMessage";

const qwertyKeyboardKeyMap = new Map<string, Key>([
	["1", { octave: 5, tone: "C" }],
	["2", { octave: 5, tone: "C#" }],
	["3", { octave: 5, tone: "D" }],
	["4", { octave: 5, tone: "D#" }],
	["5", { octave: 5, tone: "E" }],
	["6", { octave: 5, tone: "F" }],
	["7", { octave: 5, tone: "F#" }],
	["8", { octave: 5, tone: "G" }],
	["9", { octave: 5, tone: "G#" }],
	["0", { octave: 5, tone: "A" }],
	["-", { octave: 5, tone: "A#" }],
	["=", { octave: 5, tone: "B" }],

	["q", { octave: 4, tone: "C" }],
	["w", { octave: 4, tone: "C#" }],
	["e", { octave: 4, tone: "D" }],
	["r", { octave: 4, tone: "D#" }],
	["t", { octave: 4, tone: "E" }],
	["y", { octave: 4, tone: "F" }],
	["u", { octave: 4, tone: "F#" }],
	["i", { octave: 4, tone: "G" }],
	["o", { octave: 4, tone: "G#" }],
	["p", { octave: 4, tone: "A" }],
	["[", { octave: 4, tone: "A#" }],
	["]", { octave: 4, tone: "B" }],

	["a", { octave: 3, tone: "C" }],
	["s", { octave: 3, tone: "C#" }],
	["d", { octave: 3, tone: "D" }],
	["f", { octave: 3, tone: "D#" }],
	["g", { octave: 3, tone: "E" }],
	["h", { octave: 3, tone: "F" }],
	["j", { octave: 3, tone: "F#" }],
	["k", { octave: 3, tone: "G" }],
	["l", { octave: 3, tone: "G#" }],
	[";", { octave: 3, tone: "A" }],
	// These *could* be bound, but browsers usually bind them to something else.
	// ["'", { octave: 3, tone: "A#" }],
	// ["enter", { octave: 3, tone: "B" }],

	["z", { octave: 2, tone: "C" }],
	["x", { octave: 2, tone: "C#" }],
	["c", { octave: 2, tone: "D" }],
	["v", { octave: 2, tone: "D#" }],
	["b", { octave: 2, tone: "E" }],
	["n", { octave: 2, tone: "F" }],
	["m", { octave: 2, tone: "F#" }],
	[",", { octave: 2, tone: "G" }],
	[".", { octave: 2, tone: "G#" }],
	// These *could* be bound, but browsers usually bind them to something else.
	// ["/", { octave: 2, tone: "A" }],
	// ["\\", { octave: 2, tone: "A#" }],
	// ["`", { octave: 2, tone: "A" }],
]);

export const bindKeyboardKeyEvents = (
	container: HTMLElement,
	midiEventHandler: MidiEventHandler
): void => {
	const handleKeyEvent = (
		keyboardKey: string,
		command: MidiCommand
	): void => {
		keyboardKey = keyboardKey.toLowerCase();
		if (!qwertyKeyboardKeyMap.has(keyboardKey)) {
			return;
		}
		const key = qwertyKeyboardKeyMap.get(keyboardKey)!;
		midiEventHandler({ command, key });
	};
	container.addEventListener("keydown", (e) =>
		handleKeyEvent(e.key, MidiCommand.NOTE_ON)
	);
	container.addEventListener("keyup", (e) =>
		handleKeyEvent(e.key, MidiCommand.NOTE_OFF)
	);
};
