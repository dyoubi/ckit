export type Literal = string | number | boolean | null;
export type LiteralObject = {
	[key: string]: Literal | Literal[] | LiteralObject | LiteralObject[];
};