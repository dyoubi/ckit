import { ModuleDefinition } from "./module";
import { Constructor } from "../common";

export type BindingKey = Constructor | string | symbol;
export interface ValueBinding<T = unknown> { key: BindingKey; value: Constructor<T> | T; };
export type Provider<T = any> = Constructor<T> | ValueBinding<T>;

export function isValueBinding<T>(provider: Provider<T>): provider is ValueBinding<T> {
	return (provider as ValueBinding<T>).key !== undefined && (provider as ValueBinding<T>).value !== undefined;
}

export function isConstructor<T>(provider: any): provider is Constructor<T> {
	try {
		new (new Proxy(provider, { construct() { return {}; } }));
	} catch (error) {
		return false;
	}
	return true;
}

export interface IContext {
	/**
	 * Registers a provider within the registry.
	 * @param provider The provider to register.
	 */
	bind<T = any>(provider: Provider<T>): void;
	/**
	 * Resolves and returns an instance of the requested type or binding.
	 * @param key The key or class type to resolve.
	 * @returns The resolved instance.
	 */
	get<T = any>(key: BindingKey): T;
	/**
	 * Initializes the context by bootstrapping the specified modules.
	 * This method sets up the necessary configurations and dependencies for the modules.
	 * @param modules An optional array of module definitions to bootstrap.
	 * @returns A promise that resolves when the bootstrapping process is complete.
	 */
	bootstrap(modules?: ModuleDefinition[]): Promise<void>;
	/**
	 * Gracefully shuts down the context.
	 * This method performs any necessary cleanup operations before terminating the context.
	 * @param code An optional exit code to indicate the status of the shutdown.
	 * @returns A promise that resolves when the shutdown process is complete.
	 */
	shutdown(code?: number): Promise<void>;
}


/**
 * Wrapper for ioc cointainer.
 * @deprecated use IContext instead
 */
export interface IRegistry {
	/**
	 * Registers a provider within the registry.
	 * @param provider The provider to register.
	 */
	bind<T = any>(provider: Provider<T>): void;

	/**
	 * Removes an entry from the registry
	 * @param key The binding key 
	 */
	unbind(key: BindingKey): void;

	/**
	 * Resolves and returns an instance of the requested type or binding.
	 * @param key The key or class type to resolve.
	 * @returns The resolved instance.
	 */
	get<T = any>(key: BindingKey): T;

	/**
	 * Removes all entries from the registry
	 */
	flush(): void;
}
