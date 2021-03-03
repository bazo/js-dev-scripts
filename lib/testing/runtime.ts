type SuitOrTestName = string | (() => string) | (() => Promise<string>);

type Callback = () => void | Promise<void>;
type TestCallback = () => void | Promise<void>;

interface TestCase {
	suiteName: string;
	name: string;
	cb: TestCallback;
}

export interface TestResult {
	suiteName: string;
	name: string;
	passed: boolean;
	error: any;
	time: [number, number];
}

export interface SuiteResults {
	[testName: string]: TestResult;
}

export interface Results {
	[suiteName: string]: SuiteResults;
}

export default class Tester {
	private tests: TestCase[] = [];
	private currentSuite = "";
	private results: Results = {};

	public describe = async (suiteName: SuitOrTestName, cb: Callback): Promise<void> => {
		const name = typeof suiteName === "string" ? suiteName : await suiteName();

		this.currentSuite = name;
		cb();
		this.currentSuite = "";
	};

	public test = async (testName: SuitOrTestName, cb: TestCallback): Promise<void> => {
		const name = typeof testName === "string" ? testName : await testName();

		this.tests.push({ suiteName: this.currentSuite, name, cb });
	};

	public run = async (): Promise<void> => {
		for (const { suiteName, name, cb } of this.tests) {
			if (!this.results[suiteName]) {
				this.results[suiteName] = {} as SuiteResults;
			}

			const start = process.hrtime();
			try {
				await cb();
				const time = process.hrtime(start);
				this.results[suiteName][name] = { suiteName, name, passed: true, error: null, time };
			} catch (error) {
				const time = process.hrtime(start);
				this.results[suiteName][name] = { suiteName, name, passed: false, error, time };
			}
		}
	};

	public getResults = (): Results => {
		return this.results;
	};
}
