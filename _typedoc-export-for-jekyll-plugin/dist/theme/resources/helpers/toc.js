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
    exports.toc = void 0;
    const theme_1 = require("../../theme");
    function toc() {
        return theme_1.default.HANDLEBARS.helpers.toc(this);
    }
    exports.toc = toc;
});
