package org.felixrilling.socketsynth.midi;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import javax.sound.midi.InvalidMidiDataException;
import javax.sound.midi.ShortMessage;

@Service
class MidiService {

	/**
	 * Parses the byte sequence as a MIDI message.
	 *
	 * @param rawMessage raw MIDI message.
	 * @return The parsed message.
	 * @throws InvalidMidiDataException if parsing fails (due to invalid input).
	 * @see javax.sound.midi.MidiMessage
	 */
	public @NotNull MidiChannelMessage deserialize(byte[] rawMessage) throws InvalidMidiDataException {
		if (rawMessage.length != 3) {
			throw new InvalidMidiDataException("Unexpected length: %s.".formatted(rawMessage.length));
		}

		ShortMessage shortMessage = new ShortMessage(rawMessage[0], rawMessage[1], rawMessage[2]);

		int command = shortMessage.getCommand();
		if (command != ShortMessage.NOTE_ON && command != ShortMessage.NOTE_OFF) {
			throw new InvalidMidiDataException("Unsupported command: %d.".formatted(command));
		}

		int channel = shortMessage.getChannel();
		int note = shortMessage.getData1();
		return new MidiChannelMessage(command, channel, note);
	}
}
