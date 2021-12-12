import type { Logger } from "loglevel";
import { getLogger as getLoglevelLogger, levels } from "loglevel";
import { DEVELOPMENT_MODE } from "./mode";

const getLogger = (consumer: string): Logger => {
	const logger = getLoglevelLogger(consumer);
	logger.setLevel(DEVELOPMENT_MODE ? levels.DEBUG : levels.WARN);
	return logger;
};

export { getLogger };
