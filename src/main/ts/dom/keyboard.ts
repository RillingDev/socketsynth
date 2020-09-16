import type { MidiEvent } from "../audio/midiEvent";
import { Type } from "../audio/midiEvent";
import type { Note } from "../audio/note";
import { getNoteString, KEYS } from "../audio/note";

interface KeyboardKey {
    readonly element: HTMLElement;
    readonly markPlayingStatus: (type: Type) => void;
}

const createKeyboardKeyComponent = (
    note: Note,
    midiEventHandler: (midiEvent: MidiEvent) => void
): KeyboardKey => {
    const element = document.createElement("button");
    element.textContent = getNoteString(note);
    element.addEventListener("mousedown", () =>
        midiEventHandler({
            note,
            type: Type.PRESS,
        })
    );
    element.addEventListener("mouseup", () =>
        midiEventHandler({
            note,
            type: Type.RELEASE,
        })
    );
    element.addEventListener("mouseout", () =>
        midiEventHandler({
            note,
            type: Type.RELEASE,
        })
    );

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

interface Keyboard {
    readonly markPlayingStatus: (midiEvent: MidiEvent) => void;
}

export const createKeyboardComponent = (
    container: HTMLElement,
    startingOctave: number,
    endingOctave: number,
    midiEventHandler: (midiEvent: MidiEvent) => void
): Keyboard => {
    const keys: Map<string, KeyboardKey> = new Map<string, KeyboardKey>();

    for (let octave = startingOctave; octave <= endingOctave; octave++) {
        for (const key of KEYS) {
            const note = { key, octave };
            const keyboardKey = createKeyboardKeyComponent(
                note,
                midiEventHandler
            );
            keyboardKey.element.classList.add("keyboard__key");
            keys.set(getNoteString(note), keyboardKey);
        }
    }

    container.classList.add("keyboard");
    const keyElements = Array.from(keys.values()).map(
        (keyboardKey) => keyboardKey.element
    );
    container.append(...keyElements);

    const markPlayingStatus = (midiEvent: MidiEvent): void => {
        const noteString = getNoteString(midiEvent.note);
        if (!keys.has(noteString)) {
            throw new Error(
                `Could not find key element for note '${noteString}'.`
            );
        }
        keys.get(noteString)!.markPlayingStatus(midiEvent.type);
    };

    return {
        markPlayingStatus,
    };
};
