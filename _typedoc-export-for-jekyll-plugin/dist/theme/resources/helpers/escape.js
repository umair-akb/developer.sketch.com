(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.escape = void 0;
    function escape(str) {
        return str
            .replace(/>/g, '\\>')
            .replace(/_/g, '\\_')
            .replace(/`/g, '\\`')
            .replace(/\|/g, '\\|');
    }
    exports.escape = escape;
});
