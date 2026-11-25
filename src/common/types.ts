export type ValueOrPromise<T = void> = T | Promise<T>;
export type Literal =
	| boolean
	| string
	| number | bigint
	| undefined | null;
	
export type LiteralObject = {
	[key: string]: Literal | Literal[] | LiteralObject | LiteralObject[];
};