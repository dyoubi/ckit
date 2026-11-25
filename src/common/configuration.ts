import { readFileSync } from "fs";
import { parseEnv } from "util";

export class Configuration {
	readonly _values: Record<string, any | null> = {} as const;
	constructor(values: Record<string, any>) {
		// Load environment variables into #_env
		for (const key of Object.keys(values)) {
			this._values[key] = values[key] ?? null;
		}
	}

	/**
	 * Retrieves a string value for the given configuration key or null if the key does not exist.
	 * @param {string} key - The configuration key.
	 * @param {object} [opts] - Optional parameters. Currently unused but provided for future compatibility.
	 * @returns {string | null} The string value of the configuration if it exists, or null otherwise.
	 */
	getStringOrNull(key: string): string | null {
		if (this.has(key)) {
			return this.getString(key);
		} else {
			return null;
		}
	}

	/**
	 * Retrieves a number value for the given configuration key or null if the key does not exist.
	 * @param {string} key - The configuration key.
	 * @param {object} [opts] - Optional parameters. Currently unused but provided for future compatibility.
	 * @returns {number | null} The number value of the configuration if it exists, or null otherwise.
	 */
	getNumberOrNull(key: string): number | null {
		if (this.has(key)) {
			return this.getNumber(key);
		} else {
			return null;
		}
	}

	/**
	 * Retrieves an object value for the given configuration key or null if the key does not exist.
	 * @param {string} key - The configuration key.
	 * @param {object} [opts] - Optional parameters. Currently unused but provided for future compatibility.
	 * @returns {T | null} The object value of the configuration if it exists, or null otherwise.
	 */
	getObjectOrNull<T extends object>(key: string): T | null {
		if (this.has(key)) {
			return this.getObject<T>(key);
		} else {
			return null;
		}
	}

	/**
	 * Retrieves a value of any type for the given configuration key or null if the key does not exist.
	 * This method is a placeholder to be implemented.
	 * @param {string} key - The configuration key.
	 * @param {object} [opts] - Optional parameters. Currently unused but provided for future compatibility.
	 * @throws {Error} Indicates that the method has not been implemented yet.
	 */
	getAnyOrNull(key: string) {
		return this._values[key] ?? null;
	}

	/**
	 * Retrieves a configuration value by its key, throwing an error if the key doesn't exist unless specified otherwise.
	 * @param {string} key - The key of the configuration to retrieve.
	 * @param {ConfigOptions} [opts] - Optional parameters to control behavior, like throwing an error if the key is not found.
	 * @returns {T} The value associated with the key.
	 */
	get<T = any>(key: string): T {
		if (!this.has(key)) {
			throw new Error(`Configuration key "${key}" not found.`);
		}

		return this._values[key] as T;
	}

	/**
	  * Retrieves a string value for the given configuration key.
	  * @param {string} key - The configuration key.
	  * @param {ConfigOptions} [opts] - Optional parameters.
	  * @returns {string} The string value of the configuration.
	  */
	getString(key: string): string {
		const value = this.get<string>(key);
		if (typeof value !== 'string') {
			throw new Error(`Expected a string for "${key}" but got ${typeof value}.`);
		}
		return value;
	}

	/**
	 * Retrieves a number value for the given configuration key.
	 * @param {string} key - The configuration key.
	 * @param {ConfigOptions} [opts] - Optional parameters.
	 * @returns {number} The number value of the configuration.
	 */
	getNumber(key: string): number {
		const value = this.get<string>(key);
		const numberValue = Number(value);
		if (isNaN(numberValue)) {
			throw new Error(`Expected a number for "${key}" but got ${value}.`);
		}
		return numberValue;
	}

	/**
	 * Retrieves an object value for the given configuration key.
	 * @param {string} key - The configuration key.
	 * @param {ConfigOptions} [opts] - Optional parameters.
	 * @returns {T} The object value of the configuration.
	 */
	getObject<T extends object>(key: string): T {
		const value = this._values[key] as string;
		const parse = JSON.parse(value);
		if (typeof parse !== 'object') {
			throw new Error(`Expected an object for "${key}" but got ${typeof parse}.`);
		}
		return parse as T;
	}

	/**
	 * Retrieves any type of value for the given configuration key. This method does not perform type checks.
	 * @param {string} key - The configuration key.
	 * @param {ConfigOptions} [opts] - Optional parameters.
	 * @returns {any} The value of the configuration.
	 */
	getAny(key: string) {
		return this.get<any>(key);
	}

	/**
	 * Lists all configuration keys.
	 * @returns {string[]} An array of all configuration keys.
	 */
	keys(): string[] {
		return Object.keys(this._values);
	}

	/**
	 * Checks if the specified configuration key exists.
	 * @param {string} key The configuration key to check.
	 * @returns {boolean} True if the key exists, false otherwise.
	 */
	has(key: string): boolean {
		return key in this._values;
	}

	/**
	 * Sets the value for the specified configuration key.
	 * @param {string} key The configuration key to set.
	 * @param {any} value The value to set for the configuration key.
	 */
	set(key: string, value: any): void {
		this._values[key] = value;
	}

	static fromEnv(envPath?: string): Configuration {
		const opts = envPath ? parseEnv(readFileSync(envPath).toString()) : process.env;
		return new Configuration(opts);
	}
}