"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.formatTestDuration = exports.formatMilliseconds = exports.getMillisecondsFromHrTime = exports.showTotalResults = exports.showErrorOrigin = exports.padMultilineText = exports.prefix = exports.processTscLintResult = exports.processLintResult = exports.clearConsole = exports.createMessage = exports.formatChokidarEvent = void 0;
var chalk_1 = require("chalk");
var path = require("path");
var source_map_1 = require("source-map");
var cli_highlight_1 = require("cli-highlight");
var figures_1 = require("figures");
var pretty_ms_1 = require("pretty-ms");
var convert_hrtime_1 = require("convert-hrtime");
function formatChokidarEvent(eventName, path) {
    switch (eventName) {
        case "add":
            return "File " + chalk_1["default"].green(path) + " added";
        case "change":
            return "File " + chalk_1["default"].green(path) + " changed";
        case "unlink": {
            return "File " + chalk_1["default"].green(path) + " removed";
        }
        default:
            return "";
    }
}
exports.formatChokidarEvent = formatChokidarEvent;
function createMessage(event, data) {
    return JSON.stringify({ event: event, data: data });
}
exports.createMessage = createMessage;
function clearConsole() {
    process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
}
exports.clearConsole = clearConsole;
function processLintResult(_a) {
    var _b = _a.results, results = _b === void 0 ? [] : _b;
    if (results.length > 0) {
        console.log("\n");
        results.forEach(function (result) {
            if (result.messages.length > 0) {
                var header = chalk_1["default"].bgWhite.black(path.relative(process.cwd(), result.filePath)) + " \n";
                var messages = result.messages.map(function (message) {
                    return chalk_1["default"].bold("    Line " + message.line + ":" + message.column + ":") + "  " + message.message + " " + (message.severity === 1 ? chalk_1["default"].underline.yellow(message.ruleId) : chalk_1["default"].underline.red(message.ruleId)) + "\n";
                });
                console.log("" + header + messages.join(""));
            }
        });
    }
}
exports.processLintResult = processLintResult;
function processTscLintResult(results) {
    if (results.length > 0) {
        console.log("\n");
        results.forEach(function (_a) {
            var result = _a.value;
            var header = chalk_1["default"].bgWhite.black(path.relative(process.cwd(), result.path.value)) + " \n";
            var message = chalk_1["default"].bold("    Line " + result.cursor.value.line + ":" + result.cursor.value.col + ":") + "  " + result.message.value.trim() + " " + chalk_1["default"].underline.red(result.tsError.value.errorString) + "\n";
            console.log("" + header + message);
        });
    }
}
exports.processTscLintResult = processTscLintResult;
function prefix(text) {
    return "[" + chalk_1["default"].bold(text.toUpperCase()) + "]:";
}
exports.prefix = prefix;
function padMultilineText(text, indent) {
    if (indent === void 0) { indent = 4; }
    var lines = text.split("\n");
    return lines.map(function (line) { return line.padStart(indent + line.length, " "); }).join("\n");
}
exports.padMultilineText = padMultilineText;
function getOriginalPosition(error, sourceMap) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var linesAndColumns, line, column, json, rawSourceMap;
        var _b;
        return __generator(this, function (_c) {
            linesAndColumns = (_a = error.stack) === null || _a === void 0 ? void 0 : _a.match(/at [\/\w\.\_\s()-]*:(\d+:\d+)/);
            line = null;
            column = null;
            if (linesAndColumns) {
                _b = linesAndColumns[1].split(":").map(function (numString) { return parseInt(numString); }), line = _b[0], column = _b[1];
            }
            json = Buffer.from(sourceMap.substring(29), "base64").toString();
            rawSourceMap = JSON.parse(json);
            return [2 /*return*/, source_map_1.SourceMapConsumer["with"](rawSourceMap, null, function (consumer) {
                    return consumer.originalPositionFor({
                        line: line,
                        column: column
                    });
                })];
        });
    });
}
function showErrorOrigin(error, code, sourceMap) {
    return __awaiter(this, void 0, void 0, function () {
        var originalPosition, lines, start, end, linesToShow, highlightedLines, index, line, prefix_1, prefix2, prefix_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getOriginalPosition(error, sourceMap)];
                case 1:
                    originalPosition = _a.sent();
                    lines = code.split("\n");
                    start = Math.max(0, originalPosition.line - 5);
                    end = originalPosition.line + 5;
                    linesToShow = lines.slice(start, end);
                    highlightedLines = cli_highlight_1.highlight(linesToShow.join("\n"), {
                        language: "ts",
                        theme: {
                            string: chalk_1["default"].green,
                            number: chalk_1["default"].magenta,
                            keyword: chalk_1["default"].cyan
                        }
                    }).split("\n");
                    linesToShow = [];
                    for (index = 0; index < highlightedLines.length; index++) {
                        line = highlightedLines[index];
                        if (start + index === originalPosition.line - 2) {
                            prefix_1 = (chalk_1["default"].red(figures_1["default"].pointer) + " " + (start + index + 1) + " | ").padStart(20, " ");
                            linesToShow.push(chalk_1["default"].dim(prefix_1) + " " + chalk_1["default"].dim(line));
                            prefix2 = "| ".padStart(10, " ");
                            linesToShow.push(chalk_1["default"].dim(prefix2) + " " + chalk_1["default"].red("^").padStart(originalPosition.column + 20 + 2, " "));
                        }
                        else {
                            prefix_2 = (start + index + 1 + " | ").padStart(10, " ");
                            linesToShow.push(chalk_1["default"].dim(prefix_2) + " " + line);
                        }
                    }
                    linesToShow.push("");
                    return [2 /*return*/, linesToShow.join("\n")];
            }
        });
    });
}
exports.showErrorOrigin = showErrorOrigin;
function showTotalResults(suites, tests, totalTime) {
    if (suites === void 0) { suites = { total: 0, failed: 0 }; }
    if (tests === void 0) { tests = { total: 0, failed: 0 }; }
    if (totalTime === void 0) { totalTime = 0; }
    var header = function (text) {
        return chalk_1["default"].white(text.padEnd(12, " "));
    };
    return [
        (header("Test Suites:") + " " + (suites.failed ? chalk_1["default"].red(suites.failed + " failed") + ", " : "") + (suites.total - suites.failed > 0 ? chalk_1["default"].green(suites.total - suites.failed + " passed") + ", " : "") + suites.total + " total").trim(),
        (header("Tests:") + " " + (tests.failed ? chalk_1["default"].red(tests.failed + " failed") + ", " : "") + (tests.total - tests.failed > 0 ? chalk_1["default"].green(tests.total - tests.failed + " passed") + ", " : "") + tests.total + " total").trim(),
        (header("Time:") + " " + formatMilliseconds(totalTime)).trim(),
    ].join("\n");
}
exports.showTotalResults = showTotalResults;
function getMillisecondsFromHrTime(hrTime) {
    return convert_hrtime_1["default"](hrTime).milliseconds;
}
exports.getMillisecondsFromHrTime = getMillisecondsFromHrTime;
function formatMilliseconds(milliseconds) {
    return pretty_ms_1["default"](milliseconds, {
        millisecondsDecimalDigits: 4
    });
}
exports.formatMilliseconds = formatMilliseconds;
function formatTestDuration(hrTime) {
    return formatMilliseconds(getMillisecondsFromHrTime(hrTime));
}
exports.formatTestDuration = formatTestDuration;
