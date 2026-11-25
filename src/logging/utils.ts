

export function getOwnFunctionNames(target: Function) {
	return Object.getOwnPropertyNames(target.prototype)
		.filter(v => v !== 'constructor' && typeof target.prototype[v] === 'function');
}

export function getOwnStaticFunctionNames(target: Function): string[] {
	return Object.getOwnPropertyNames(target)
		.filter(
			(v) =>
				!['length', 'name', 'prototype'].includes(v) &&
				typeof (target as any)[v] === 'function'
		);
}

export function cloneFunctionMetadata(source: Function, target: Function) {
	Object.getOwnPropertyNames(source).forEach((key) => {
		try {
			const desc = Object.getOwnPropertyDescriptor(source, key);
			if (desc && key !== 'name' && key !== 'length') {
				Object.defineProperty(target, key, desc);
			}
		} catch { /**/ }
	});
}

export function isClassDecorator(args: unknown[]) {
	return (args.length === 1 && typeof args[0] === 'function');
}

export function isMethodDecorator(args: unknown[]) {
	return (args.length === 3 && typeof args[2] === 'object');
}