import {
	getFrequencyForNote,
	getNote,
	getStringForNote,
} from "../../../main/ts/audio/note";

//https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies

describe("getNote", () => {
	it("returns spec value", () => {
		expect(getNote("C", -1)).toBe(0);

		expect(getNote("A", 0)).toBe(21);

		expect(getNote("C", 1)).toBe(24);
		expect(getNote("C#", 1)).toBe(25);
		expect(getNote("D", 1)).toBe(26);
		expect(getNote("D#", 1)).toBe(27);
		expect(getNote("E", 1)).toBe(28);
		expect(getNote("F", 1)).toBe(29);
		expect(getNote("F#", 1)).toBe(30);
		expect(getNote("G", 1)).toBe(31);
		expect(getNote("G#", 1)).toBe(32);
		expect(getNote("A", 1)).toBe(33);
		expect(getNote("A#", 1)).toBe(34);
		expect(getNote("B", 1)).toBe(35);

		expect(getNote("C", 4)).toBe(60);

		expect(getNote("G", 9)).toBe(127);
	});
});

describe("getNoteString", () => {
	it("returns spec value", () => {
		expect(getStringForNote(0)).toBe("C-1");

		expect(getStringForNote(21)).toBe("A0");

		expect(getStringForNote(24)).toBe("C1");
		expect(getStringForNote(25)).toBe("C#1");
		expect(getStringForNote(26)).toBe("D1");
		expect(getStringForNote(27)).toBe("D#1");
		expect(getStringForNote(28)).toBe("E1");
		expect(getStringForNote(29)).toBe("F1");
		expect(getStringForNote(30)).toBe("F#1");
		expect(getStringForNote(31)).toBe("G1");
		expect(getStringForNote(32)).toBe("G#1");
		expect(getStringForNote(33)).toBe("A1");
		expect(getStringForNote(34)).toBe("A#1");
		expect(getStringForNote(35)).toBe("B1");

		expect(getStringForNote(60)).toBe("C4");

		expect(getStringForNote(127)).toBe("G9");
	});
});

// Based on https://en.wikipedia.org/wiki/Piano_key_frequencies
describe("getFrequencyForNote", () => {
	it("returns spec value", () => {
		expect(getFrequencyForNote(getNote("A", 0))).toBeCloseTo(27.5, 2);
		expect(getFrequencyForNote(getNote("A", 4))).toBeCloseTo(440.0, 2);
		expect(getFrequencyForNote(getNote("A", 7))).toBeCloseTo(3520.0, 2);
	});
});
