export default class FileManager {
	filesMap = new Map<string, string>();

	public setFile(name: string, contents: string): void {
		this.filesMap.set(name, contents);
	}

	public getContents(name: string): string | undefined {
		return this.filesMap.get(name);
	}

	public hasFile(name: string): boolean {
		return this.filesMap.has(name);
	}
}
