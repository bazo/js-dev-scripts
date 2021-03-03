import zlib from "zlib";
import { promisify } from "util";

const gzipper = promisify(zlib.gzip);

export function gzip(input: zlib.InputType, options: zlib.ZlibOptions = {}): Promise<Buffer> {
	return gzipper(input, { level: 9, ...options });
}
