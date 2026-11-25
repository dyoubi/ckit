import { IContext,Provider } from "./types";

export type SetupFunction = (ioc: IContext, ...args: unknown[]) => Promise<void> | void;
export type ShutdownFunction = (ioc: IContext, code: number) => Promise<void> | void;

export interface ModuleDefinition {
    imports?: ModuleDefinition[];
    exports?: Provider[];
    setup?: SetupFunction;
    shutdown?: ShutdownFunction;
}