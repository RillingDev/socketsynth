package org.felixrilling.socketsynth.model;

public class MidiEvent {
    private String key;
    private int octave;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public int getOctave() {
        return octave;
    }

    public void setOctave(int octave) {
        this.octave = octave;
    }

    @Override
    public String toString() {
        return "MidiEvent{" +
                "key='" + key + '\'' +
                ", octave=" + octave +
                '}';
    }
}
