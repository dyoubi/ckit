import { describe, it, expect } from 'vitest';
import { Configuration } from '../common';

describe('Configuration', () => {
	const configValues = {
		APP_NAME: 'TestApp',
		PORT: '3000',
		DEBUG: 'true',
		SETTINGS: JSON.stringify({ theme: 'dark', layout: 'grid' }),
		UNDEFINED: undefined
	};

	const config = new Configuration(configValues);

	it('should return string value', () => {
		expect(config.getString('APP_NAME')).toBe('TestApp');
	});

	it('should return number value from string', () => {
		expect(config.getNumber('PORT')).toBe(3000);
	});

	it('should return object value from JSON string', () => {
		const obj = config.getObject<{ theme: string; layout: string }>('SETTINGS');
		expect(obj.theme).toBe('dark');
		expect(obj.layout).toBe('grid');
	});

	it('should return string or null', () => {
		expect(config.getStringOrNull('APP_NAME')).toBe('TestApp');
		expect(config.getStringOrNull('UNKNOWN')).toBeNull();
	});

	it('should return number or null', () => {
		expect(config.getNumberOrNull('PORT')).toBe(3000);
		expect(config.getNumberOrNull('UNKNOWN')).toBeNull();
	});

	it('should return object or null', () => {
		expect(config.getObjectOrNull('SETTINGS')).toMatchObject({ theme: 'dark' });
		expect(config.getObjectOrNull('UNKNOWN')).toBeNull();
	});

	it('should throw on wrong type access', () => {
		config.set('MALFORMED', 42);
		expect(() => config.getString('MALFORMED')).toThrow();
		expect(() => config.getObject('MALFORMED')).toThrow();
	});

	it('should throw if key is missing', () => {
		expect(() => config.get('UNKNOWN')).toThrowError('Configuration key "UNKNOWN" not found.');
	});

	it('should support .has() and .keys()', () => {
		expect(config.has('APP_NAME')).toBe(true);
		expect(config.has('UNKNOWN')).toBe(false);
		expect(config.keys()).toContain('APP_NAME');
	});
});
