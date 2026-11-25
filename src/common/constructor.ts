export interface Constructor<T = unknown> {
	// eslint-disable-next-line @typescript-eslint/prefer-function-type
	new(...args: any[]): T;
};