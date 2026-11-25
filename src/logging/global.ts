import {
	ILogger, ConsoleLogger, LogLevel,
	LoggerProxy,
	IProxyFactory,
	Monitoring, ProxyOptions
} from "./types";

let __g_logger: ILogger = new ConsoleLogger();
let __g_monitoring: GlobalMonitoring;
let __g_proxy_factory: IProxyFactory = new LoggerProxy();

class GlobalMonitoring implements Monitoring {
	private isEnabled: boolean = false;
	public get enabled(): boolean { return this.isEnabled; };
	enable(): void { this.isEnabled = true; }
	deable(): void { this.isEnabled = false; }
}

export function initMonitoring(opts: { factory: IProxyFactory; }): Readonly<Monitoring> {
	if (!__g_monitoring) { __g_monitoring = new GlobalMonitoring(); }
	__g_proxy_factory = opts.factory;
	return __g_monitoring;
}

export function getMontitoring(): Readonly<Monitoring> {
	if (!__g_monitoring) { throw new Error('monitoring not set'); }
	return __g_monitoring;
}

export function applyProxy(thisValue: any, method: Function, args: unknown[], options: ProxyOptions) {
	if (!__g_proxy_factory) { throw new Error('factory is not set'); }
	try {
		return __g_proxy_factory.proxy(thisValue, method, args, options);
	} catch (error) {
		log.error(`function proxy failure ${error.message}`);
		throw error;
	}
}

/**
 * @deprecated use log instead
 * @returns ILogger
 */
export const getLogger = (): Readonly<ILogger> => __g_logger;

/**
 * set the global log class
 * @param logger logger class to use
 */
export const setLogger = (logger: ILogger = new ConsoleLogger()) => { __g_logger = logger; };

/**
 * access to global logger class
*/
export const log: ILogger = {
	debug(...args: unknown[]) { __g_logger.debug(...args); },
	info(...args: unknown[]) { __g_logger.info(...args); },
	trace(...args: unknown[]) { __g_logger.trace(...args); },
	warn(...args: unknown[]) { __g_logger.warn(...args); },
	error(...args: unknown[]) { __g_logger.error(...args); },
	log(level: LogLevel, ...args: unknown[]) { __g_logger.log(level, ...args); },
};

/**
  * @deprecated use log instead
 */
export const logger: Readonly<ILogger> = log;