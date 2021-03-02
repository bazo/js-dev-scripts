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

			try {
				cb();
				this.results[suiteName][name] = { suiteName, name, passed: true, error: null };
			} catch (error) {
				if (error.matcherResult) {
					//console.log(error);
					//console.log(error.matcherResult.message());
				} else {
					//console.log(error);
				}
				this.results[suiteName][name] = { suiteName, name, passed: false, error };
			}
		}
	};

	public getResults = (): Results => {
		return this.results;
	};
}
