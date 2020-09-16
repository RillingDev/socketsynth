import type { Key } from "./key";

export enum Type {
    PRESS = "PRESS",
    RELEASE = "RELEASE",
}

export interface MidiEvent {
    readonly key: Key;
    readonly type: Type;
}

export type MidiEventHandler = (midiEvent: MidiEvent) => void;
