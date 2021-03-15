import { ModuleKind, transpileModule } from "typescript";
import * as vm from "vm";

export function typeScriptLoaderSync(filepath: string, content: string): Record<string, any> | null {
	const code = transpileModule(content, { compilerOptions: { module: ModuleKind.CommonJS } });

	if (module.paths === undefined) {
		module.paths = [];
	}
	module.paths = module.paths.concat([`${process.cwd()}/node_modules`]);

	const script = new vm.Script(code.outputText);

	const context = vm.createContext({ exports, require, console, process });
	return script.runInContext(context, {
		filename: filepath,
	});
}
