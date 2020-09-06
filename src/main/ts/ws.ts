import { Client } from "@stomp/stompjs";
import { getLogger } from "./logger";

const logger = getLogger("StompClient");

export const createClient = (url: string): Promise<Client> =>
    new Promise((resolve, reject) => {
        const client = new Client({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            brokerURL: url,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => resolve(client);

        client.onStompError = (frame) => {
            logger.error("Broker reported error: ", frame);
            reject();
        };

        client.activate();
    });

export interface JsonClient<T> {
    publish: (destination: string, data: T) => void;
    subscribe: (destination: string, callback: (data: T) => void) => void;
}

export const wrapAsJsonClient = <T>(client: Client): JsonClient<T> => {
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
