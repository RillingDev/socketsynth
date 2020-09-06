import type { MidiEvent } from "./midiEvent";
import { NOTE_TABLE } from "./notes";

export const createKeyboard = (
    container: HTMLElement,
    onPress: (midiEvent: MidiEvent) => void
): void => {
    const keys: HTMLElement[] = [];
    for (
        let octaveNumber = 0;
        octaveNumber < NOTE_TABLE.length;
        octaveNumber++
    ) {
        const octaveKeys = NOTE_TABLE[octaveNumber];
        for (const key of Object.keys(octaveKeys)) {
            const keyElement = document.createElement("button");
            keyElement.textContent = `${key}${octaveNumber}`;
            keyElement.addEventListener("click", () =>
                onPress({ key, octave: octaveNumber })
            );
            keys.push(keyElement);
        }
    }
    container.append(...keys);
};
