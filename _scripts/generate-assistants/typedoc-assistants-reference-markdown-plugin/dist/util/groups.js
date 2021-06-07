"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortReferenceByName = exports.pruneReferences = exports.pruneGroupReferences = exports.importReflection = exports.importReflections = exports.importIntoGroup = exports.hasChild = exports.getGroupsChildren = exports.inspect = void 0;
const typedoc_1 = require("typedoc");
var util_1 = require("util");
Object.defineProperty(exports, "inspect", { enumerable: true, get: function () { return util_1.inspect; } });
function getGroupsChildren(groups) {
    return groups.reduce((dst, group) => {
        group.children.forEach((child) => dst.push(child));
        return dst;
    }, []);
}
exports.getGroupsChildren = getGroupsChildren;
function hasChild(a, b) {
    return (a ? a.findIndex(child => child.id == b.id) != -1 : false);
}
exports.hasChild = hasChild;
function importIntoGroup(group, source, project, logger) {
    var _a;
    if (source.kindOf(typedoc_1.ReflectionKind.SomeModule)) {
        source.traverse((child) => {
            importIntoGroup(group, child, project, logger);
        });
        source.children = [];
    }
    else {
        if (source.kindOf(typedoc_1.ReflectionKind.Reference)) {
            source = source.getTargetReflectionDeep();
        }
        if (!hasChild(project.children, source)) {
            source.parent = project;
            (_a = project.children) === null || _a === void 0 ? void 0 : _a.push(source);
            group.children.push(source);
        }
    }
}
exports.importIntoGroup = importIntoGroup;
function importReflections(source, target) {
    if (source.kindOf(typedoc_1.ReflectionKind.SomeModule)) {
        source.traverse((child) => {
            importReflections(child, target);
        });
        source.children = [];
    }
    else {
        importReflection(source, target);
    }
}
exports.importReflections = importReflections;
function importReflection(source, target) {
    var _a;
    source.parent = target;
    (_a = target.children) === null || _a === void 0 ? void 0 : _a.push(source);
}
exports.importReflection = importReflection;
function pruneGroupReferences(group) {
    const nonReferenceReflections = group
        .children
        .filter(child => !child.kindOf(typedoc_1.ReflectionKind.Reference));
    group
        .children
        .filter(child => child.kindOf(typedoc_1.ReflectionKind.Reference))
        .forEach((ref) => {
        var _a;
        if (nonReferenceReflections.find(ref => ref.name == ref.name)) {
            const idx = group.children.findIndex(child => child.id == ref.id);
            if (idx != undefined && idx >= 0) {
                (_a = group.children) === null || _a === void 0 ? void 0 : _a.splice(idx, 1);
            }
        }
    });
}
exports.pruneGroupReferences = pruneGroupReferences;
function pruneReferences(parent) {
    const nonReferenceReflections = parent
        .getChildrenByKind(typedoc_1.ReflectionKind.All ^ typedoc_1.ReflectionKind.Reference);
    parent
        .getChildrenByKind(typedoc_1.ReflectionKind.Reference)
        .forEach((ref) => {
        var _a, _b;
        if (nonReferenceReflections.find(ref => ref.name == ref.name)) {
            const idx = (_a = parent.children) === null || _a === void 0 ? void 0 : _a.findIndex(child => child.id == ref.id);
            if (idx != undefined && idx >= 0) {
                (_b = parent.children) === null || _b === void 0 ? void 0 : _b.splice(idx, 1);
            }
        }
    });
}
exports.pruneReferences = pruneReferences;
function sortReferenceByName(a, b) {
    return a.name.localeCompare(b.name);
}
exports.sortReferenceByName = sortReferenceByName;
