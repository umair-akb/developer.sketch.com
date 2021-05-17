"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlFriendlyName = void 0;
function urlFriendlyName(word) {
    if (!word)
        return word;
    word = word.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    word.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return word;
}
exports.urlFriendlyName = urlFriendlyName;
