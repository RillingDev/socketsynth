package org.felixrilling.socketsynth.midi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MidiController {

    private static final Logger logger = LoggerFactory.getLogger(MidiController.class);

    @MessageMapping("/midi/input")
    @SendTo("/topic/midi/output")
    public MidiEvent input(MidiEvent event) {
        logger.info("Received event {}.", event);
        return event;
    }
}
