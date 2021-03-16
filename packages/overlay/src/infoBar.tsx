/* eslint-disable @typescript-eslint/ban-ts-comment */
import Nano, { Component } from "nano-jsx";
import { Store } from "nano-jsx/lib/store";
import { Spinner } from "spin.js";

import css from "./infoBarStyle";

const spinnerOptions = {
	lines: 12, // The number of lines to draw
	length: 0, // The length of each line
	width: 17, // The line thickness
	radius: 40, // The radius of the inner circle
	scale: 0.1, // Scales overall size of the spinner
	corners: 1, // Corner roundness (0..1)
	speed: 0.9, // Rounds per second
	rotate: 0, // The rotation offset
	animation: "spinner-line-fade-more", // The CSS animation name for the lines
	direction: 1, // 1: clockwise, -1: counterclockwise
	color: "#ffffff", // CSS color or array of colors
	fadeColor: "transparent", // CSS color or array of colors
	top: "50%", // Top position relative to parent
	left: "50%", // Left position relative to parent
	shadow: "0 0 1px transparent", // Box-shadow for the lines
	zIndex: 2000000000, // The z-index (defaults to 2e9)
	className: "spinner", // The CSS class to assign to the spinner
	position: "absolute", // Element positioning
};

export const infoBarStore = new Store({ show: false }, "info-bar-store", "memory");
const spinner = new Spinner(spinnerOptions);

interface State {
	show: boolean;
}

class InfoBar extends Component {
	store = infoBarStore.use();

	getSpinnerRef() {
		return document.getElementById("__dev-scripts-info-bar-spinner");
	}

	didMount() {
		this.store.subscribe((newState: State, prevState: State) => {
			// check if you need to update your component or not
			if (newState.show !== prevState.show) {
				this.update();
			}

			if (newState.show) {
				spinner.spin(this.getSpinnerRef());
			} else {
				spinner.stop();
			}
		});
	}

	didUnmount() {
		// cancel the store subscription
		this.store.cancel();
	}

	//@ts-ignore
	render() {
		return (
			//@ts-ignore
			<div class={`container ${this.store.state.show ? "shown" : ""}`}>
				<style>{css}</style>
				<div id="__dev-scripts-info-bar-spinner" />
			</div>
		);
	}
}

export default InfoBar;
