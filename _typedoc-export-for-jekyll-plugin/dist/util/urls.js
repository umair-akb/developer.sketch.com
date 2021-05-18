"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripMdExt = exports.urlFriendlyName = void 0;
function urlFriendlyName(word) {
    if (!word)
        return word;
    word = word.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    word.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return word;
}
exports.urlFriendlyName = urlFriendlyName;
function stripMdExt(path) {
    return path.replace(/(.*)(\.md)/, "$1");
}
exports.stripMdExt = stripMdExt;
