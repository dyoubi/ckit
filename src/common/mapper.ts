
/** @deprecated use Mapper instead */
export type MapFunction<In = any, Out = any> = (input: In) => Out;

export type Mapper<In = any, Out = any> = (input: In) => Out;

export type Difference<T> = {
    [K in keyof T]: {
        from: T[K];
        to: T[K];
    };
};