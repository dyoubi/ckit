import "reflect-metadata";

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModuleDefinition, Provider } from '../ioc';
import { Context } from "../ioc/context";

class ServiceA {
	ping() {
		return 'pong';
	}
}

const valueProvider: Provider<{ hello: () => string; }> = {
	key: 'greeter',
	value: {
		hello: () => 'hello world'
	}
};

describe('Context', async () => {
	let ctx: Context = new Context();

	beforeEach(() => {
		ctx = new Context();
	});


	it('should bind and resolve class provider', () => {
		ctx.bind(ServiceA);
		const instance = ctx.get(ServiceA);
		expect(instance).toBeInstanceOf(ServiceA);
		expect(instance.ping()).toBe('pong');
	});

	it('should bind and resolve value provider', () => {
		ctx.bind(valueProvider);
		const greeter = ctx.get('greeter');
		expect(greeter.hello()).toBe('hello world');
	});

	it('should execute setup hooks on bootstrap', async () => {
		const setup = vi.fn();
		const module: ModuleDefinition = { setup };
		await ctx.bootstrap([module]);
		expect(setup).toHaveBeenCalledOnce();
	});

	it('should execute shutdown hooks on shutdown', async () => {
		const shutdown = vi.fn();
		const module: ModuleDefinition = { shutdown };
		await ctx.bootstrap([module]);
		await ctx.shutdown();
		expect(shutdown).toHaveBeenCalledOnce();
	});

	it('should not run duplicate setup or shutdown hooks', async () => {
		const hook = vi.fn();
		const module: ModuleDefinition = { setup: hook, shutdown: hook };
		await ctx.bootstrap([module, module]);
		await ctx.shutdown();
		expect(hook).toHaveBeenCalledTimes(2); // once for setup, once for shutdown
	});

	it('should throw ERR_BOOTSTRAP on setup error', async () => {
		const errorModule: ModuleDefinition = {
			setup() {
				throw new Error('test');
			}
		};
		await expect(ctx.bootstrap([errorModule]))
			.rejects.toThrowError('ERR_BOOTSTRAP : test');
	});

	it('should throw ERR_SHUTDOWN on shutdown error', async () => {
		const errorModule: ModuleDefinition = {
			shutdown: () => { throw new Error('test'); }
		};
		await ctx.bootstrap([errorModule]);
		await expect(ctx.shutdown())
			.rejects.toThrowError('ERR_SHUTDOWN : test');
	});
});