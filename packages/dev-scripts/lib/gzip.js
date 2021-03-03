"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.gzip = void 0;
var zlib_1 = require("zlib");
var util_1 = require("util");
var gzipper = util_1.promisify(zlib_1["default"].gzip);
function gzip(input, options) {
    if (options === void 0) { options = {}; }
    return gzipper(input, __assign({ level: 9 }, options));
}
exports.gzip = gzip;
