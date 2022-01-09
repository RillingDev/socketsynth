package org.felixrilling.socketsynth.midi;

/**
 * Not actually MIDI (sorry). Just a simple event associated with a piano key.
 */
record MidiEvent(Key key, Type type) {

	enum Type {
		PRESS, RELEASE;

		@Override
		public String toString() {
			return name();
		}
	}
}
