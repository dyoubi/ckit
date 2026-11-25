export const LOG_DEBUG = 'debug';
export const LOG_TRACE = 'trace';
export const LOG_INFO = 'info';
export const LOG_WARN = 'warn';
export const LOG_ERROR = 'error';

export enum ELogLevel {
	debug = 'debug',
	trace = 'trace',
	info = 'info',
	warn = 'warn',
	error = 'error',
}

export type LogLevel = `${ELogLevel}`;

export interface ILogger {
	debug(...args: unknown[]): void;
	info(...args: unknown[]): void;
	trace(...args: unknown[]): void;
	warn(...args: unknown[]): void;
	error(...args: unknown[]): void;
	log(level: LogLevel, ...args: unknown[]): void;
}

export class ConsoleLogger {
	debug(...args: unknown[]): void { this.log('debug', ...args); };
	info(...args: unknown[]): void { this.log('info', ...args); };
	trace(...args: unknown[]): void { this.log('trace', ...args); };
	warn(...args: unknown[]): void { this.log('warn', ...args); };
	error(...args: unknown[]): void { this.log('error', ...args); };
	log(level: LogLevel, ...args: unknown[]) { console.log(`[${level.toUpperCase()}]`, ...args); };
}

export interface ProxyOptions {
	tag: string;
	attributes?: Record<string, string | number | boolean | Date>;
};

export interface IProxyFactory {
	proxy(thisValue: any, method: Function, args: unknown[], options: ProxyOptions): any;
}

export interface Monitoring {
	enabled: boolean;
	enable(): void;
	deable(): void;
}

export class LoggerProxy implements IProxyFactory {
	proxy(thisValue: any, method: Function, args: unknown[], options: ProxyOptions) {
		let finish = false;
		const terminate = () => {
			if (!finish) {
				console.log('terminate target', options.tag);
				finish = true;
			}
		};
		try {
			console.log('run target', options.tag, thisValue, method, args);
			const returnValue = method.apply(thisValue, args);
			if (returnValue instanceof Promise) {
				return returnValue.then((v) => {
					console.log('async returnValue', v);
					terminate();
					return v;
				}).catch((error) => {
					console.log('async error', error.message);
					terminate();
					throw error;
				});
			} else {
				console.log('async returnValue', returnValue);
				terminate();
				return returnValue;
			}
		} catch (error) {
			console.log('sync error', error.message);
			terminate();
			throw error;
		}
	}
}