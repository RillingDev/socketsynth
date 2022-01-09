package org.felixrilling.socketsynth.midi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import javax.sound.midi.InvalidMidiDataException;

@Controller
class MidiController {

	private static final Logger logger = LoggerFactory.getLogger(MidiController.class);

	private final MidiService midiService;

	MidiController(MidiService midiService) {
		this.midiService = midiService;
	}

	@MessageMapping("/midi/input")
	@SendTo("/topic/midi/output")
	public byte[] input(byte[] rawMidiMessage) throws InvalidMidiDataException {
		// Parse message as a form of validation before relaying the original message.
		MidiChannelMessage midiChannelMessage = midiService.deserialize(rawMidiMessage);
		logger.info("Relaying event with type '{}' on channel '{}' and key '{}'.",
			midiChannelMessage.type(),
			midiChannelMessage.channel(),
			midiChannelMessage.note());

		return rawMidiMessage;
	}

}
