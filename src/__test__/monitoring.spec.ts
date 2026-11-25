import { describe, it, expect, beforeEach } from 'vitest';
import { initMonitoring } from '../logging/global';
import type { IProxyFactory, ProxyOptions } from '../logging/types';
import { monitor } from '../logging/decorators';
import { isMethodDecorator } from '../logging/utils';

const TEST_DECORATOR_SYMBOL = Symbol('@testDecorator');
function testDecorator() {
	return function (...args: any[]) {
		if (isMethodDecorator(args)) {
			const descriptor = args[2] as PropertyDescriptor;
			descriptor.value[TEST_DECORATOR_SYMBOL] = true;
		}
	};
}

class SpyProxy implements IProxyFactory {
	calls: any[] = [];

	proxy(thisValue: any, method: Function, args: unknown[], options: ProxyOptions) {
		this.calls.push({ tag: options.tag, thisValue, args });
		return method.apply(thisValue, args);
	}
}

describe('@monitor', () => {
	let proxy: SpyProxy;

	beforeEach(() => {
		proxy = new SpyProxy();
		initMonitoring({ factory: proxy }).enable();
	});

	it('should wrap instance methods', () => {
		@monitor()
		class TestClass {
			hello(name: string) {
				return `Hello, ${name}`;
			}
		}

		const instance = new TestClass();
		const result = instance.hello('world');
		expect(result).toBe('Hello, world');
		expect(proxy.calls.length).toBe(1);
		expect(proxy.calls[0].tag).toBe('TestClass.hello');
	});

	it('should respect exclude option', () => {
		@monitor({ exclude: ['ignored'] })
		class ExcludedTest {
			ignored() {
				return 'nope';
			}
			included() {
				return 'yep';
			}
		}

		const inst = new ExcludedTest();
		inst.ignored();
		inst.included();
		expect(proxy.calls.length).toBe(1);
		expect(proxy.calls[0].tag).toBe('ExcludedTest.included');
	});

	it('should wrap static methods', () => {
		@monitor()
		class StaticTest {
			static run() {
				return 'static';
			}
		}

		const result = StaticTest.run();
		expect(result).toBe('static');
		expect(proxy.calls.length).toBe(1);
		expect(proxy.calls[0].tag).toBe('StaticTest.run');
	});

	it('should not wrap already decorated methods', () => {
		@monitor({ tag: 'CustomTag.hello' })
		class Base {
			@monitor({ tag: 'AlreadyWrapped' })
			hello() {
				return 'hello';
			}
		}

		new Base().hello();
		expect(proxy.calls.length).toBe(1);
		expect(proxy.calls[0].tag).toBe('AlreadyWrapped');
	});

	it('should preserve existing decorators when method is already wrapped', () => {
		class Base {
			@testDecorator()
			@monitor({ tag: 'Wrapped' })
			hello() {
				return 'hello';
			}
		}

		const inst = new Base();
		inst.hello();

		expect(proxy.calls.length).toBe(1);
		expect(proxy.calls[0].tag).toBe('Wrapped');
		expect((inst.hello as any)[TEST_DECORATOR_SYMBOL]).toBe(true);
	});

});