/* eslint-disable @typescript-eslint/no-unused-vars */
import { FieldsQuery, QueryWhere, Where } from ".";

export type IDType =
	| string
	| number
	| bigint
	| Date
	| Uint8Array;

export interface IRepository<T extends object, ID extends (Partial<T> | IDType) = any> {
	create(data: Partial<T>): Promise<T>;
	find(query?: QueryWhere<T>): Promise<T[]>;
	findOne(query?: QueryWhere<T>): Promise<T | null>;
	findById(id: ID, query?: FieldsQuery<T>): Promise<T>;
	count(query?: QueryWhere<T>): Promise<number>;
	update(data: Partial<T>, where?: Where<T>): Promise<void>;
	updateById(id: ID, data: Partial<T>, opts?: object): Promise<void>;
	delete(where: Where<T>): Promise<void>;
	deleteById(id: ID): Promise<void>;
}