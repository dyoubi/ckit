export interface IUseCase<In = any, Out = any> {
	execute(input: In): Out | Promise<Out>;
}

export type UseCaseClass<In = any, Out = any> = (new (...args: any[]) => IUseCase<In, Out>);