import { ClassProvider, container, DependencyContainer, InjectionToken, ValueProvider } from "tsyringe";

import { BindingKey, IContext, isConstructor, isValueBinding, Provider } from "./types";
import { ModuleDefinition, SetupFunction, ShutdownFunction } from "./module";

import { debuglog } from 'util';

const debug = debuglog('CKIT:CONTEXT');
export class Context implements IContext {
	private readonly $container: DependencyContainer;
	private setupHooks = new Set<SetupFunction>();
	private shutdownHooks = new Set<ShutdownFunction>();

	constructor() {
		this.$container = container.createChildContainer();
	}

	bind<T = any>(provider: Provider<T>): void {
		let token: InjectionToken | null = null;
		let bindingValue: ClassProvider<T> | ValueProvider<T> | undefined;

		if (isConstructor(provider)) {
			token = provider;
			bindingValue = { useClass: provider } as ClassProvider<T>;
		} else if (isValueBinding(provider)) {
			token = provider.key;
			bindingValue = (isConstructor<T>(provider.value) ? { useClass: provider.value } as ClassProvider<T> :
				{ useValue: provider.value } as ValueProvider<T>);
		}

		if (token && bindingValue) {
			if (!this.$container.isRegistered(token)) {
				this.$container.register(token, bindingValue as any);
			} else {
				debug('token already bound', typeof token === 'function' ? token.name : String(token));
			}
		}
	}

	get<T = any>(key: BindingKey): T {
		return this.$container.resolve(key) as T;
	}

	has(key: BindingKey): boolean {
		return this.$container.isRegistered(key);
	}

	async bootstrap(modules?: ModuleDefinition[]): Promise<void> {
		for (const module of modules ?? []) {
			if (module.imports) {
				await this.bootstrap(module.imports);
			}
			if (module.setup) this.setupHooks.add(module.setup);


			if (module.shutdown) this.shutdownHooks.add(module.shutdown);


			if (module.exports) {
				module.exports.forEach((provider) => { this.bind(provider); });
			}
		}

		for (const hook of this.setupHooks) {
			try {
				await hook(this);
			} catch (error) {
				throw new Error('ERR_BOOTSTRAP : ' + error.message);
			}
		};
	}

	async shutdown(code?: number): Promise<void> {
		for (const hook of this.shutdownHooks) {
			try {
				await hook(this, code ?? 0);
			} catch (error) {
				throw new Error('ERR_SHUTDOWN : ' + error.message);
			}
		};
		this.dispose();
	}

	dispose() {
		this.setupHooks.clear();
		this.shutdownHooks.clear();
		this.$container.dispose();
	};
}