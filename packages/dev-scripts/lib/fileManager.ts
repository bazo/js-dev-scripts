export default class FileManager {
	filesMap = new Map<string, string | Buffer>();

	public setFile(name: string, contents: Buffer | string): void {
		this.filesMap.set(name, contents);
	}

	public getContents(name: string): string | Buffer | undefined {
		return this.filesMap.get(name);
	}

	public hasFile(name: string): boolean {
		return this.filesMap.has(name);
	}
}
