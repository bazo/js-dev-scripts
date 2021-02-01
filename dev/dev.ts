import "panic-overlay/build/panic-overlay.browser";
import { ConstantBackoff, WebsocketBuilder } from "websocket-ts";
import { Message } from "../lib/types";

interface MyWindow {
	WEBSOCKET_PORT: number;
}

const wsPort = ((window as unknown) as MyWindow).WEBSOCKET_PORT;

const ws = new WebsocketBuilder(`ws://localhost:${wsPort}`)
	.withBackoff(new ConstantBackoff(500))
	.onOpen((i, ev) => {
		console.info("DevServer connecting...");
	})
	.onClose((i, ev) => {
		console.info("DevServer connection lost");
	})
	.onError((i, ev) => {
		console.info("DevServer connection error");
	})
	.onMessage((i, ev: MessageEvent<string>) => {
		const msg = JSON.parse(ev.data);
		handleMessage(msg);
	})
	.onRetry((i, ev) => {
		console.info("Retrying DevServer connection");
	})
	.build();

function handleMessage({ event, data }: Message) {
	switch (event) {
		case "dev-server-connected": {
			console.info("DevServer connected");
			return;
		}
		case "bundle-built": {
			console.info("Bundle built. Reloading...");
			window.location.reload();
		}
	}
}
