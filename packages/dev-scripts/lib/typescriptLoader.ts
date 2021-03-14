import ts from "typescript";
import * as vm from "vm";

export function typeScriptLoaderSync(filepath: string, content: string): Record<string, any> | null {
	const code = ts.transpileModule(content, { compilerOptions: { module: ts.ModuleKind.CommonJS } });

	const script = new vm.Script(code.outputText);
	const context = vm.createContext({ exports: {} });
	return script.runInContext(context);
}
