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
    exports.comment = void 0;
    const theme_1 = require("../../theme");
    function comment() {
        const md = [];
        if (this.shortText) {
            md.push(theme_1.default.HANDLEBARS.helpers.comment.call(this.shortText));
        }
        if (this.text) {
            md.push(theme_1.default.HANDLEBARS.helpers.comment.call(this.text));
        }
        if (this.tags) {
            const tags = this.tags.map((tag) => `**\`${tag.tagName}\`**${tag.text
                ? theme_1.default.HANDLEBARS.helpers.comment.call((tag.text.startsWith('\n') ? '' : ' ') + tag.text)
                : ''}`);
            md.push(tags.join('\n\n'));
        }
        return md.join('\n\n');
    }
    exports.comment = comment;
});
