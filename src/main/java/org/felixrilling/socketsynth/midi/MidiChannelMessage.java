package org.felixrilling.socketsynth.midi;

/**
 * Very simple MIDI message without velocity.
 */
record MidiChannelMessage(int type, int channel, int note) {
}
