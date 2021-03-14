import * as http from "http";
import * as https from "https";

export default function proxy(req: http.IncomingMessage, res: http.ServerResponse, url: string): void {
	const isHttps = url.startsWith("https://");

	let request: http.ClientRequest;
	if (isHttps) {
		request = https.request(url, {
			method: req.method,
			headers: req.headers,
		});
	} else {
		request = http.request(url, {
			method: req.method,
			headers: req.headers,
		});
	}

	request.on("response", (response) => {
		response.pipe(res);
	});

	if (["POST", "PUT", "PATCH"].includes(req.method as string)) {
		req.on("data", (chunk: any) => {
			request.write(chunk);
		});

		req.on("end", () => {
			request.end();
		});
	} else {
		request.end();
	}
}
