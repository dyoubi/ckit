/**
 * List of available comparison operators.
 */
export const OperatorsLiteral = [
  'eq', // Equal
  'neq', // Not Equal
  'gt', // >
  'gte', // >=
  'lt', // <
  'lte', // <=
  'inq', // IN
  'nin', // NOT IN
  'between', // BETWEEN [val1, val2]
  'exists',
  'and', // AND
  'or', // OR
  'like', // LIKE
  'nlike', // NOT LIKE
  'ilike', // ILIKE'
  'nilike', // NOT ILIKE
  'regexp', // REGEXP'
] as const;

/**
 * Value types for `{propertyName: value}`.
 */
export type ShortHandEqualType = string | number | boolean | Date;

/**
 * Key types of a given model, excluding operators.
 */
export type KeyOf<MT extends object> = Exclude<
  Extract<keyof MT, string>,
  Operators
>;

/**
 * Operators for WHERE clauses.
 */
export type Operators = typeof OperatorsLiteral[number];

/**
 * Generic predicate comparison.
 */
export interface PredicateComparison<PT> {
  eq?: PT;
  neq?: PT;
  gt?: PT;
  gte?: PT;
  lt?: PT;
  lte?: PT;
  inq?: PT[];
  nin?: PT[];
  between?: [PT, PT];
  exists?: boolean;
  like?: PT;
  nlike?: PT;
  ilike?: PT;
  nilike?: PT;
  regexp?: string | RegExp;
  // [extendedOperation: string]: any;
};

/**
 * Condition clause.
 *
 * @example
 * ```ts
 * {
 *   name: {inq: ['John', 'Mary']},
 *   status: 'ACTIVE',
 *   age: {gte: 40}
 * }
 * ```
 */
export type Condition<QT extends object> = {
  [P in KeyOf<QT>]?: Record<Operators, QT[P]> | (QT[P] & ShortHandEqualType);
};

/**
 * List of fields for a model.
 */
export type Fields<T extends object> = (keyof T)[];

/**
 * Type of value for WHERE clauses.
 */
export type WhereValue = string | boolean | number | object;

/**
 * WHERE clause.
 */
export type Where<T extends object> = {
  [P in keyof T]?: T[P] | WhereValue | Condition<T>;
};

/**
 * Options for fetching fields.
 */
export interface FieldsQuery<T extends object> {
  fields?: Fields<T>;
  relations?: Record<string, boolean>;
};

/**
 * Options for the WHERE clause.
 */
export interface WhereQuery<T extends object> { where?: Where<T>[] | Where<T>; };

export type SortDirection = 'ASC' | 'DESC';

/**
 * Options for sorting.
 */
export interface SortQuery<T extends object> {
  sort?: Partial<Record<keyof T, SortDirection | undefined | null>>;
};

/**
 * Options for the general query.
 */
export type Query<T extends object> =
  & FieldsQuery<T>
  & SortQuery<T>
  & {
    limit?: number;
    offset?: number;
    [props: string]: unknown;
  };

/**
 * Options for the query with WHERE clause.
 */
export type QueryWhere<T extends object> = Query<T> & WhereQuery<T>;

/**
 * Options for the query by ID.
 */
export type QueryById<T extends object> =
  & FieldsQuery<T>
  & {
    id: string;
    [props: string]: unknown;
  };

/**
 * Function for transforming the query.
 */
export type QueryTransformer<T extends object, O extends object> = (query: Query<T>) => O;

/**
 * Function for transforming the WHERE clause.
 */
export type WhereTransformer<T extends object, O extends object> = (where: QueryWhere<T>) => O;
