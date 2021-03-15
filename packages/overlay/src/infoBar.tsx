/* eslint-disable @typescript-eslint/ban-ts-comment */
import Nano, { Component } from "nano-jsx";
import { Store } from "nano-jsx/lib/store";
import { Spinner } from "spin.js";

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
				<style>
					{`
/* node_modules/spin.js/spin.css */
@keyframes spinner-line-fade-more {
  0%, 100% {
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
}
@keyframes spinner-line-fade-quick {
  0%, 39%, 100% {
    opacity: 0.25;
  }
  40% {
    opacity: 1;
  }
}
@keyframes spinner-line-fade-default {
  0%, 100% {
    opacity: 0.22;
  }
  1% {
    opacity: 1;
  }
}
@keyframes spinner-line-shrink {
  0%, 25%, 100% {
    transform: scale(0.5);
    opacity: 0.25;
  }
  26% {
    transform: scale(1);
    opacity: 1;
  }
}
				
#__dev-scripts-info-bar .container {
	width: 24px;
	height: 24px;
	position: absolute;
	bottom: 10px;
	right: 30px;
	border-radius: 3px;
	background: #000;
	color: #fff;
	font: initial;
	cursor: initial;
	letter-spacing: initial;
	text-shadow: initial;
	text-transform: initial;
	visibility: initial;
	padding: 7px 10px 8px 10px;
	align-items: center;
	box-shadow: 0 11px 40px 0 rgb(0 0 0 / 25%), 0 2px 10px 0 rgb(0 0 0 / 12%);
	display: none;
	opacity: 0;
	transition: opacity 0.1s ease, bottom 0.1s ease;
	animation: fade-in 0.1s ease-in-out;
}
#__dev-scripts-info-bar .container.shown {
	display: block;
	opacity: 1;
}`}
				</style>
				<div id="__dev-scripts-info-bar-spinner" />
			</div>
		);
	}
}

export default InfoBar;
