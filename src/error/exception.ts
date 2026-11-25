export enum ErrorSystem { system = 'system', database = 'database' };
export type ErrorSystemType = `${ErrorSystem}`;
export enum ErrorProtocol {
	amq = 'amqp',
	http = 'http',
	grpc = 'grpc',
	tcp = 'tcp',
	udp = 'udp',
	websocket = 'websocket',
}
export type ErrorProtocolType = `${ErrorProtocol}`;
export type ErrorType = ErrorProtocolType | ErrorSystemType;

export interface IException {
	type?: string;
	code?: number;
	details?: any;
	original?: Exception;
}

export type ExceptionConstructor = new (
	msg?: string,
	details?: any,
	original?: Error
) => IException;

export class Exception extends Error implements IException {
	constructor(
		msg?: string,
		public type?: string,
		public code?: number,
		public details?: any,
		public original?: Exception,
	) { super(msg); }

	static from(error: Error, type?: ErrorType, code?: number, details?: any,) {
		return new Exception(error.message, type, code, details);
	}
}

export class SystemException extends Exception { }

export class ServerException extends Exception {
	readonly statusCode: string;
	constructor(
		msg?: string,
		type?: ErrorType,
		readonly status?: string,
		statusCode?: string | number,
		details?: any,
		original?: Exception,
	) {
		super(msg, type, Number(statusCode), details, original);
		this.statusCode = String(statusCode);
	}
}