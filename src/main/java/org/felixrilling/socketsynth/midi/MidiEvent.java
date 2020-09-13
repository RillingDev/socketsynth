package org.felixrilling.socketsynth.midi;

public class MidiEvent {
    private Note note;
    private Type type;

    public Note getNote() {
        return note;
    }

    public void setNote(Note note) {
        this.note = note;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "MidiEvent{" +
                "note=" + note +
                ", type=" + type +
                '}';
    }

    enum Type {
        PRESS, RELEASE;

        @Override
        public String toString() {
            return name();
        }
    }
}
