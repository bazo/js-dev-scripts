/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line simple-import-sort/imports
import Prism from "prismjs";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-tsx.js";

import Nano, { Component } from "nano-jsx";
import { Store } from "nano-jsx/lib/store";

//@ts-ignore
import css from "prismjs/themes/prism-tomorrow.css";

import { showErrorOrigin } from "./sourceMaps";
import StackTracey from "stacktracey";

function hashCode(text: string): number {
	let hash = 0;
	if (text.length === 0) {
		return hash;
	}
	for (let i = 0; i < text.length; i++) {
		const chr = text.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}

interface ErrorData {
	message: string;
	stack: StackTracey;
}

interface State {
	data: ErrorData[];
	page: number;
}

const defaultState: State = {
	data: [],
	page: 1,
};

export const errorStore = new Store(defaultState, "error-store", "memory");

const addErrorData = (data: ErrorData) => {
	const state = errorStore.state as State;
	const newState = { ...state, data: state.data.concat([data]) };
	errorStore.setState(newState);
};

interface ErrorPageProps {
	data: ErrorData;
}

class ErrorPage extends Component<ErrorPageProps> {
	didMount() {
		const { stack } = this.props.data;

		for (const { beforeParse, line, sourceFile, thirdParty } of stack.items) {
			const hash = hashCode(beforeParse);

			const els = document.getElementsByClassName(hash.toString());
			for (let i = 0; i < els.length; i++) {
				const el = els[i];
				el.textContent = showErrorOrigin(sourceFile.lines, line).replaceAll("@", " ");
			}
		}

		Prism.highlightAll();
	}

	render() {
		const { message, stack } = this.props.data;

		return (
			<div>
				<h1>{message}</h1>

				{stack.items.map(({ callee, beforeParse, fileRelative, line, thirdParty, sourceFile }, index) => {
					const hash = hashCode(beforeParse);
					return (
						<div class="stack-block">
							<span class="method">{callee || "(anonymous)"}</span>
							<br />
							<span class="file">
								{fileRelative}:{line}
							</span>
							{sourceFile.lines.length > 0 ? (
								<pre class={index === 0 ? "main" : ""}>
									<code class={`${hash.toString()} language-tsx`}></code>
								</pre>
							) : null}
						</div>
					);
				})}
			</div>
		);
	}
}

class ErrorOverlay extends Component {
	store = errorStore.use();

	didMount() {
		this.store.subscribe(() => {
			this.update();
			Prism.highlightAll();
		});

		this.update();
	}

	didUnmount() {
		this.store.cancel();
	}

	prevPage = () => {
		const { page } = this.store.state as State;
		const prevPage = Math.max(1, page - 1);
		this.store.setState({ ...this.store.state, page: prevPage });
	};

	nextPage = () => {
		const { page, data } = this.store.state as State;
		const nextPage = Math.min(data.length, page + 1);
		this.store.setState({ ...this.store.state, page: nextPage });
	};

	render() {
		const { page } = this.store.state as State;
		const data = this.store.state.data;
		const pageData = data[page - 1];

		return (
			<div class="content">
				<style>
					{css}
					{`body {
					background-color: #282b2d;
					font-size: 12px;
				}
				#__dev-scripts-error-overlay {
					height: 100vh;
					width: 100%;
					position: absolute;
					top:0;
					right: 0;
					bottom: 0;
				}
				#__dev-scripts-error-overlay .content {
					width: 60%;
					margin: 0 auto;
				}
				#__dev-scripts-error-overlay {
					font-family: Consolas, Menlo, monospace;
					font-size: 1em;
				}

				#__dev-scripts-error-overlay pre[class*="language-"] {
					background-color: rgba(251, 245, 180, 0.1);
				}

				#__dev-scripts-error-overlay pre[class*="language-"].main {
					//background: #453234;
					background-color: rgba(206, 17, 38, 0.1);
				}

				#__dev-scripts-error-overlay h1 {
					color: #E83B46;
					font-size: 1.5em;
				}
				#__dev-scripts-error-overlay .error-pagination {
					display: flex;
					color: rgb(135, 142, 145);
				}
				#__dev-scripts-error-overlay .error-pagination .arrow {
					cursor: pointer;
				}
				#__dev-scripts-error-overlay .stack-block {
					margin-bottom: 15px;
				}
				#__dev-scripts-error-overlay .stack-block .method {
					color: #fff;
				}
				#__dev-scripts-error-overlay .stack-block .file {
					color: rgb(135, 142, 145);
				}
				`}
				</style>
				{data && data.length > 1 ? (
					<div class="error-pagination">
						<div class="arrow arrow-back" onClick={this.prevPage}>
							←
						</div>
						&nbsp;
						<div class="arrow arrow-next" onClick={this.nextPage}>
							→
						</div>
						&nbsp;&nbsp;
						{page} of {data.length} errors on the page
					</div>
				) : null}
				{pageData ? <ErrorPage data={pageData} /> : <div></div>}
			</div>
		);
	}
}

function renderOverlay() {
	const el = document.createElement("div");
	el.setAttribute("id", "__dev-scripts-error-overlay");
	document.body.appendChild(el);

	Nano.render(<ErrorOverlay />, el);
}

export default function errorOverlay() {
	let isRendered = false;
	window.addEventListener("error", (event) => {
		event.preventDefault();

		if (!isRendered) {
			renderOverlay();
			isRendered = true;
		}

		addErrorData({ message: event.error.toString(), stack: new StackTracey(event.error).withSources() });
	});
}
