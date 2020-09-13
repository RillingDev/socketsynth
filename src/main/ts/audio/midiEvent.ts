import type { Note } from "./note";

export enum Type {
    PRESS = "PRESS",
    RELEASE = "RELEASE",
}

export interface MidiEvent {
    readonly note: Note;
    readonly type: Type;
}
