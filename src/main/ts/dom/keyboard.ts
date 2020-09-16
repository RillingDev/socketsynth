import type { MidiEvent, MidiEventHandler } from "../audio/midiEvent";
import { Type } from "../audio/midiEvent";
import type { Key } from "../audio/key";
import { getKeyString, TONES } from "../audio/key";

interface KeyboardKey {
    readonly element: HTMLElement;
    readonly markPlayingStatus: (type: Type) => void;
}

const createKeyboardKeyComponent = (
    key: Key,
    midiEventHandler: MidiEventHandler
): KeyboardKey => {
    const element = document.createElement("button");
    element.textContent = getKeyString(key);
    element.addEventListener("mousedown", () =>
        midiEventHandler({
            key,
            type: Type.PRESS,
        })
    );
    element.addEventListener("mouseup", () =>
        midiEventHandler({
            key,
            type: Type.RELEASE,
        })
    );
    element.addEventListener("mouseout", () =>
        midiEventHandler({
            key,
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
    midiEventHandler: MidiEventHandler
): Keyboard => {
    const keys: Map<string, KeyboardKey> = new Map<string, KeyboardKey>();

    for (let octave = startingOctave; octave <= endingOctave; octave++) {
        for (const tone of TONES) {
            const key = { tone, octave };
            const keyboardKey = createKeyboardKeyComponent(
                key,
                midiEventHandler
            );
            keyboardKey.element.classList.add("keyboard__key");
            keys.set(getKeyString(key), keyboardKey);
        }
    }

    container.classList.add("keyboard");
    const keyElements = Array.from(keys.values()).map(
        (keyboardKey) => keyboardKey.element
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
