type LogFn = (...args: unknown[]) => void;

interface Logger {
	error: LogFn;
	warn: LogFn;
	info: LogFn;
	debug: LogFn;
	trace: LogFn;
}

export const getLogger = (name: string): Logger => {
	return {
		error: (...args) => console.error(name, ...args),
		warn: (...args) => console.warn(name, ...args),
		info: (...args) => console.info(name, ...args),
		debug: (...args) => console.debug(name, ...args),
		trace: (...args) => console.trace(name, ...args),
	};
};
