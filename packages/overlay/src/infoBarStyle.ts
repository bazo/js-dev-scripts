export default `
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
}
`;
