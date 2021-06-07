"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showSourceLink = void 0;
function showSourceLink(options) {
    if (this.sources && this.sources.length > 0) {
        const source = this.sources.find((source) => !!source.url);
        if (source && source.url) {
            const url = source.url || '';
            return `[ ](${url})`;
        }
    }
    return '';
}
exports.showSourceLink = showSourceLink;
