package org.felixrilling.socketsynth.model;

public class Note {
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
        return "Note{" +
                "key='" + key + '\'' +
                ", octave=" + octave +
                '}';
    }
}
