"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifIsEnumerationMember = exports.ifIsEnumeration = void 0;
const typedoc_1 = require("typedoc");
function ifIsEnumeration(options) {
    if (this.kind == typedoc_1.ReflectionKind.Enum) {
        return options.fn(this);
    }
}
exports.ifIsEnumeration = ifIsEnumeration;
function ifIsEnumerationMember(options) {
    if (this.kind == typedoc_1.ReflectionKind.Enum) {
        return options.fn(this);
    }
}
exports.ifIsEnumerationMember = ifIsEnumerationMember;
