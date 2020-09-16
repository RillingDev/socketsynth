import type { Client } from "@stomp/stompjs";
import { getLogger } from "../logger";
import type { MidiEvent } from "../audio/midiEvent";

interface JsonClient<T> {
    readonly publish: (destination: string, data: T) => void;
    readonly subscribe: (
        destination: string,
        callback: (data: T) => void
    ) => void;
}

const createDelegatingJsonClient = <T>(client: Client): JsonClient<T> => {
    const logger = getLogger("JsonClient");
    return {
        publish: (destination: string, data: T) => {
            logger.debug(`Publishing on '${destination}'.`);
            client.publish({
                destination,
                body: JSON.stringify(data),
            });
        },
        subscribe: (destination: string, callback: (data: T) => void) => {
            logger.debug(`Listening on '${destination}'.`);
            client.subscribe(destination, (frame) => {
                logger.debug(
                    `Received event on '${destination}': ${frame.body}.`
                );
                callback(JSON.parse(frame.body));
            });
        },
    };
};

export interface MidiEventClient {
    readonly publish: (channel: number, data: MidiEvent) => void;
    readonly subscribe: (
        channel: number,
        callback: (data: MidiEvent) => void
    ) => void;
}

export const createDelegatingMidiEventClient = (
    client: Client
): MidiEventClient => {
    const jsonClient = createDelegatingJsonClient<MidiEvent>(client);
    return {
        publish: (channel: number, data: MidiEvent) =>
            jsonClient.publish(`/app/midi/input/${channel}`, data),
        subscribe: (channel: number, callback: (data: MidiEvent) => void) =>
            jsonClient.subscribe(`/topic/midi/output/${channel}`, (data) => {
                callback(data);
            }),
    };
};
