package org.felixrilling.socketsynth.model;

public class MidiEvent {
    private String key;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    @Override
    public String toString() {
        return "MidiEvent{" +
                "key='" + key + '\'' +
                '}';
    }
}
