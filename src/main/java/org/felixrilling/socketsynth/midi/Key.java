package org.felixrilling.socketsynth.midi;

public class Key {
	private String tone;
	private int octave;

	public String getTone() {
		return tone;
	}

	public void setTone(String tone) {
		this.tone = tone;
	}

	public int getOctave() {
		return octave;
	}

	public void setOctave(int octave) {
		this.octave = octave;
	}

	@Override
	public String toString() {
		return "Key{" + "tone='" + tone + '\'' + ", octave=" + octave + '}';
	}
}
