import { promisify } from "util";
import zlib from "zlib";

const gzipper = promisify(zlib.gzip);

export function gzip(input: zlib.InputType, options: zlib.ZlibOptions = {}): Promise<Buffer> {
	return gzipper(input, { level: 9, ...options });
}
