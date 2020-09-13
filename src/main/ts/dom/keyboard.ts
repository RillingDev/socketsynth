import type { MidiEvent } from "../audio/midiEvent";
import { Type } from "../audio/midiEvent";
import { getNoteString, NOTE_FREQ_TABLE } from "../audio/note";

export const createKeyboard = (
    container: HTMLElement,
    midiEventHandler: (midiEvent: MidiEvent) => void
): void => {
    const keys: HTMLElement[] = [];
    for (let octave = 2; octave <= 6; octave++) {
        const octaveKeys = NOTE_FREQ_TABLE[octave];
        for (const key of Object.keys(octaveKeys)) {
            const keyElement = document.createElement("button");
            keyElement.textContent = getNoteString({
                key,
                octave: octave,
            });
            keyElement.addEventListener("mousedown", () =>
                midiEventHandler({
                    note: {
                        key,
                        octave,
                    },
                    type: Type.PRESS,
                })
            );
            keyElement.addEventListener("mouseup", () =>
                midiEventHandler({
                    note: {
                        key,
                        octave,
                    },
                    type: Type.RELEASE,
                })
            );
            keyElement.classList.add("keyboard__key");
            keys.push(keyElement);
        }
    }
    container.classList.add("keyboard");
    container.append(...keys);
};
