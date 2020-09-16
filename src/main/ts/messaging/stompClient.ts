import { Client } from "@stomp/stompjs";
import { getLogger } from "../logger";

const logger = getLogger("StompClient");

export const createStompClient = (url: string): Promise<Client> =>
    new Promise((resolve, reject) => {
        const client = new Client({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            brokerURL: url,
        });

        client.onConnect = () => resolve(client);

        client.onStompError = (frame) => {
            logger.error("Broker reported error: ", frame);
            reject();
        };

        client.activate();
    });
