import { Message } from "@bazo/js-dev-scripts-types";
import Nano from "nano-jsx";
import { ConstantBackoff, WebsocketBuilder } from "websocket-ts";

import errorOverlay from "./errorOverlay";
import InfoBar, { infoBarStore } from "./infoBar";

errorOverlay();

interface MyWindow {
	WEBSOCKET_PORT: number;
}

const wsPort = ((window as unknown) as MyWindow).WEBSOCKET_PORT;

const infoBar = document.createElement("div");
infoBar.setAttribute("id", "__dev-scripts-info-bar");

document.body.appendChild(infoBar);

new WebsocketBuilder(`ws://localhost:${wsPort}`)
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

const rerender = () => {
	Nano.render(<InfoBar />, infoBar);
};

rerender();

const setState = (state: Record<string, any>) => {
	infoBarStore.setState(state);
};

function handleMessage({ event, data }: Message) {
	switch (event) {
		case "dev-server-connected": {
			console.info("[DevServer] connected");
			return;
		}

		case "bundle-build-start": {
			console.info("[DevServer] Bundle build started...");
			setState({
				show: true,
			});
			break;
		}

		case "bundle-build-end": {
			console.info("[DevServer] Bundle build finished. Reloading...");

			setState({
				show: false,
			});

			window.location.reload();
			break;
		}

		case "lint-results": {
			console.info("[Lint] ");
			console.log({ data });
			break;
		}
	}
}
