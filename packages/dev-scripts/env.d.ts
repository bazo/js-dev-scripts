/// <reference types="expect/build/types" />

declare const describe: testing.Describe;
declare const test: testing.Test;
declare const expect: Expect;

declare namespace testing {
	interface FunctionLike {
		readonly name: string;
	}

	type EmptyFunction = () => void;
	type NameFunction = () => string | Promise<string>;

	interface Test {
		/**
		 * Creates a test closure.
		 *
		 * @param name The name of your test
		 * @param fn The function for your test
		 */
		(name: number | string | FunctionLike | NameFunction, fn: EmptyFunction): void;
	}

	interface Describe {
		/**
		 * Creates a suite closure.
		 *
		 * @param name The name of your suite
		 * @param fn The function for your suite
		 */
		(name: number | string | FunctionLike | NameFunction, fn: EmptyFunction): void;
	}
}
