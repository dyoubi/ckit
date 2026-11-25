import {
	cloneFunctionMetadata, getOwnFunctionNames,
	getOwnStaticFunctionNames,
	isClassDecorator,
	isMethodDecorator
} from "./utils";
import { applyProxy, getMontitoring } from "./global";
import { ProxyOptions } from "./types";

export type MonitorDecoratorOptions = Partial<ProxyOptions>;
export type MonitorMethodMetadata = MonitorDecoratorOptions;
export type MonitorClassMetadata = MonitorDecoratorOptions & { exclude?: string[]; };

const MONITORE_DECORATOR_SYMBOL = Symbol('@monitor');

function encapsulate<T extends object>(
	method: Function,
	options: ProxyOptions
): Function {
	if ((method as any)[MONITORE_DECORATOR_SYMBOL]) { return method; }

	const proxy = function (this: T, ...args: any[]) {
		const monitoring = getMontitoring();
		if (!monitoring.enabled) {
			return method.apply(this, args);
		}
		return applyProxy(this, method, args, options);
	};

	proxy[MONITORE_DECORATOR_SYMBOL] = true;
	return proxy;
}

function applyEncapsulation(
	methodNames: string[],
	opts: MonitorClassMetadata | undefined,
	// Generic method wrapper for instance or static methods
	getMethodFn: (name: string) => Function,
	setMethodFn: (name: string, fn: Function) => void,
	tagPrefix: string
) {
	for (const methodName of methodNames) {
		if (opts?.exclude?.includes(methodName)) continue;
		const method = getMethodFn(methodName);
		if ((method as any)[MONITORE_DECORATOR_SYMBOL]) continue;
		setMethodFn(methodName, encapsulate(method, {
			tag: opts?.tag ?? `${tagPrefix}.${methodName}`,
			attributes: opts?.attributes,
		}));
	}
}

export function monitor(opts?: MonitorClassMetadata | MonitorMethodMetadata) {
	return function (...args: any[]) {
		if (isClassDecorator(args)) { // class decorator
			const classTarget = args[0] as Function;

			// Wrap instance methods
			applyEncapsulation(
				getOwnFunctionNames(classTarget),
				opts,
				(name) => classTarget.prototype[name],
				(name, fn) => { classTarget.prototype[name] = fn; },
				classTarget.name
			);

			// Wrap static methods
			applyEncapsulation(
				getOwnStaticFunctionNames(classTarget),
				opts,
				(name) => (classTarget as any)[name],
				(name, fn) => { (classTarget as any)[name] = fn; },
				classTarget.name
			);

		} else if (isMethodDecorator(args)) { // method decorator
			const [target, propertyKey, descriptor] = args as [any, string, PropertyDescriptor];
			const originalMethod = descriptor.value;

			const proxy = encapsulate(originalMethod, {
				tag: opts?.tag ?? `${target.constructor.name}.${propertyKey}`,
				attributes: opts?.attributes,
			});

			cloneFunctionMetadata(originalMethod, proxy);
			descriptor.value = proxy;
		}
	};
}
