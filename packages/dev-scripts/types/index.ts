/* eslint-disable @typescript-eslint/no-explicit-any */
/*
declare var beforeAll: Lifecycle;
declare var beforeEach: Lifecycle;
declare var afterAll: Lifecycle;
declare var afterEach: Lifecycle;
*/
export declare const describe: Describe;
export declare const test: It;
export declare const run: () => void;
//declare var xtest: It;

//declare const expect: Expect;

type ExtractEachCallbackArgs<T extends ReadonlyArray<any>> = {
	1: [T[0]];
	2: [T[0], T[1]];
	3: [T[0], T[1], T[2]];
	4: [T[0], T[1], T[2], T[3]];
	5: [T[0], T[1], T[2], T[3], T[4]];
	6: [T[0], T[1], T[2], T[3], T[4], T[5]];
	7: [T[0], T[1], T[2], T[3], T[4], T[5], T[6]];
	8: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7]];
	9: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8]];
	10: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8], T[9]];
	fallback: Array<T extends ReadonlyArray<infer U> ? U : any>;
}[T extends Readonly<[any]>
	? 1
	: T extends Readonly<[any, any]>
	? 2
	: T extends Readonly<[any, any, any]>
	? 3
	: T extends Readonly<[any, any, any, any]>
	? 4
	: T extends Readonly<[any, any, any, any, any]>
	? 5
	: T extends Readonly<[any, any, any, any, any, any]>
	? 6
	: T extends Readonly<[any, any, any, any, any, any, any]>
	? 7
	: T extends Readonly<[any, any, any, any, any, any, any, any]>
	? 8
	: T extends Readonly<[any, any, any, any, any, any, any, any, any]>
	? 9
	: T extends Readonly<[any, any, any, any, any, any, any, any, any, any]>
	? 10
	: "fallback"];

interface DoneCallback {
	(...args: any[]): any;
	fail(error?: string | { message: string }): any;
}

type ProvidesCallback = (cb: DoneCallback) => any | Promise<any>;

interface FunctionLike {
	readonly name: string;
}

type NameFunction = () => string | Promise<string>;

type EmptyFunction = () => void;

interface Each {
	// Exclusively arrays.
	<T extends any[] | [any]>(cases: ReadonlyArray<T>): (name: string, fn: (...args: T) => any, timeout?: number) => void;
	<T extends ReadonlyArray<any>>(cases: ReadonlyArray<T>): (
		name: string,
		fn: (...args: ExtractEachCallbackArgs<T>) => any,
		timeout?: number
	) => void;
	// Not arrays.
	<T>(cases: ReadonlyArray<T>): (name: string, fn: (...args: T[]) => any, timeout?: number) => void;
	(cases: ReadonlyArray<ReadonlyArray<any>>): (name: string, fn: (...args: any[]) => any, timeout?: number) => void;
	(strings: TemplateStringsArray, ...placeholders: any[]): (name: string, fn: (arg: any) => any, timeout?: number) => void;
}

interface It {
	/**
	 * Creates a test closure.
	 *
	 * @param name The name of your test
	 * @param fn The function for your test
	 * @param timeout The timeout for an async function test
	 */
	(name: number | string | NameFunction | FunctionLike, fn?: ProvidesCallback, timeout?: number): void;
	/**
	 * Only runs this test in the current file.
	 */
	only: It;
	/**
	 * Skips running this test in the current file.
	 */
	skip: It;
	/**
	 * Sketch out which tests to write in the future.
	 */
	todo: It;
	/**
	 * Experimental and should be avoided.
	 */
	concurrent: It;
	/**
	 * Use if you keep duplicating the same test with different data. `.each` allows you to write the
	 * test once and pass data in.
	 *
	 * `.each` is available with two APIs:
	 *
	 * #### 1  `test.each(table)(name, fn)`
	 *
	 * - `table`: Array of Arrays with the arguments that are passed into the test fn for each row.
	 * - `name`: String the title of the test block.
	 * - `fn`: Function the test to be ran, this is the function that will receive the parameters in each row as function arguments.
	 *
	 *
	 * #### 2  `test.each table(name, fn)`
	 *
	 * - `table`: Tagged Template Literal
	 * - `name`: String the title of the test, use `$variable` to inject test data into the test title from the tagged template expressions.
	 * - `fn`: Function the test to be ran, this is the function that will receive the test data object..
	 *
	 * @example
	 *
	 * // API 1
	 * test.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
	 *   '.add(%i, %i)',
	 *   (a, b, expected) => {
	 *     expect(a + b).toBe(expected);
	 *   },
	 * );
	 *
	 * // API 2
	 * test.each`
	 * a    | b    | expected
	 * ${1} | ${1} | ${2}
	 * ${1} | ${2} | ${3}
	 * ${2} | ${1} | ${3}
	 * `('returns $expected when $a is added $b', ({a, b, expected}) => {
	 *    expect(a + b).toBe(expected);
	 * });
	 *
	 */
	each: Each;
}

interface Describe {
	(name: number | string | NameFunction | FunctionLike, fn: EmptyFunction): void;
}
