package org.felixrilling.socketsynth.midi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MidiController {

    private static final Logger logger = LoggerFactory.getLogger(MidiController.class);

    @MessageMapping("/midi/input/{channel}")
    @SendTo("/topic/midi/output/{channel}")
    public MidiEvent input(MidiEvent event, @DestinationVariable("channel") String channel) {
        logger.info("Received event '{}' on channel '{}'.", event, channel);
        return event;
    }
}
