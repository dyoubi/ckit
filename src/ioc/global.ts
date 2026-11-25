import { Context } from "./context";
import { IContext } from "./types";

export const g_context: Readonly<IContext> = new Context();