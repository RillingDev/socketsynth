package org.felixrilling.socketsynth.midi;

public class MidiEvent {
	private Key key;
	private Type type;

	public Key getKey() {
		return key;
	}

	public void setKey(Key key) {
		this.key = key;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	@Override
	public String toString() {
		return "MidiEvent{" + "key=" + key + ", type=" + type + '}';
	}

	enum Type {
		PRESS, RELEASE;

		@Override
		public String toString() {
			return name();
		}
	}
}
