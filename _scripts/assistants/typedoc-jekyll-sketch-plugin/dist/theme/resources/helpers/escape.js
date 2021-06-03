"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.code_escape = exports.escape = void 0;
function escape(str) {
    return str
        .replace(/>/g, '>')
        .replace(/_/g, '\\_')
        .replace(/`/g, '\\`')
        .replace(/\|/g, '\\|');
}
exports.escape = escape;
function code_escape(str) {
    return str
        .replace(/>/g, '>')
        .replace(/_/g, '\\_')
        .replace(/\|/g, '\\|');
}
exports.code_escape = code_escape;
