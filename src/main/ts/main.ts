import { getLogger } from "./logger";
import { createClient, wrapAsJsonClient } from "./ws";
import { MidiEvent } from "./midiEvent";

const logger = getLogger("main");

createClient("ws://localhost:8080/ws")
    .then((client) => {
        logger.info("Connected.", client);
        const jsonClient = wrapAsJsonClient<MidiEvent>(client);

        jsonClient.subscribe("/topic/midi/output", (data) => {
            logger.info("EVENT", data);
        });
        jsonClient.publish("/app/midi/input", { key: "C" });
    })
    .catch((e) => logger.error("Received error.", e));
