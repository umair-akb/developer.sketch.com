(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../theme"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.text = void 0;
    const theme_1 = require("../../theme");
    function text() {
        return theme_1.default.HANDLEBARS.helpers.comment.call(this);
    }
    exports.text = text;
});
