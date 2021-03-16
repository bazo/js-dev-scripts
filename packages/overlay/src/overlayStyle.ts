export default `
/**
 * prism.js tomorrow night eighties for JavaScript, CoffeeScript, CSS and HTML
 * Based on https://github.com/chriskempson/tomorrow-theme
 * @author Rose Pritchard
 */

code[class*="language-"],
pre[class*="language-"] {
	color: #ccc;
	background: none;
	font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
	font-size: 1em;
	text-align: left;
	white-space: pre;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
	line-height: 1.5;

	-moz-tab-size: 4;
	-o-tab-size: 4;
	tab-size: 4;

	-webkit-hyphens: none;
	-moz-hyphens: none;
	-ms-hyphens: none;
	hyphens: none;

}

/* Code blocks */
pre[class*="language-"] {
	padding: 1em;
	margin: .5em 0;
	overflow: auto;
}

:not(pre) > code[class*="language-"],
pre[class*="language-"] {
	background: #2d2d2d;
}

/* Inline code */
:not(pre) > code[class*="language-"] {
	padding: .1em;
	border-radius: .3em;
	white-space: normal;
}

.token.comment,
.token.block-comment,
.token.prolog,
.token.doctype,
.token.cdata {
	color: #999;
}

.token.punctuation {
	color: #ccc;
}

.token.tag,
.token.attr-name,
.token.namespace,
.token.deleted {
	color: #e2777a;
}

.token.function-name {
	color: #6196cc;
}

.token.boolean,
.token.number,
.token.function {
	color: #f08d49;
}

.token.property,
.token.class-name,
.token.constant,
.token.symbol {
	color: #f8c555;
}

.token.selector,
.token.important,
.token.atrule,
.token.keyword,
.token.builtin {
	color: #cc99cd;
}

.token.string,
.token.char,
.token.attr-value,
.token.regex,
.token.variable {
	color: #7ec699;
}

.token.operator,
.token.entity,
.token.url {
	color: #67cdcc;
}

.token.important,
.token.bold {
	font-weight: bold;
}
.token.italic {
	font-style: italic;
}

.token.entity {
	cursor: help;
}

.token.inserted {
	color: green;
}

body {
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
`;
