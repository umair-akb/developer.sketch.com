"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTitleCase = void 0;
function toTitleCase(word) {
    if (!word)
        return word;
    return word[0].toUpperCase() + word.substr(1);
}
exports.toTitleCase = toTitleCase;
