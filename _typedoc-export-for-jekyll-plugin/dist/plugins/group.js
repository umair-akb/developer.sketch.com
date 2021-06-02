"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GroupPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupPlugin = void 0;
/**
 * This is a full copy of TypeDoc/Converter/GroupPlugin
 *
 * Did not define a new class to extend GroupPlugin due to the
 * private methods that needed changed.
 */
const models_1 = require("typedoc/dist/lib/models");
const components_1 = require("typedoc/dist/lib/converter/components");
const converter_1 = require("typedoc/dist/lib/converter");
const GroupUtils = require("../util/groups");
/**
* A handler that sorts and groups the found reflections in the resolving phase.
*
* The handler sets the ´groups´ property of all reflections.
*/
let GroupPlugin = GroupPlugin_1 = class GroupPlugin extends components_1.ConverterComponent {
    /**
     * Create a new GroupPlugin instance.
     */
    initialize() {
        this.listenTo(this.owner, {
            [converter_1.Converter.EVENT_RESOLVE]: this.onResolve,
            [converter_1.Converter.EVENT_RESOLVE_END]: this.onEndResolve,
        });
    }
    /**
     * Triggered when the converter resolves a reflection.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently resolved.
     */
    onResolve(_context, reflection) {
        reflection.kindString = GroupPlugin_1.getKindSingular(reflection.kind);
        if (reflection instanceof models_1.ContainerReflection) {
            this.group(reflection);
        }
    }
    /**
     * Triggered when the converter has finished resolving a project.
     *
     * @param context  The context object describing the current state the converter is in.
     */
    onEndResolve(context) {
        function walkDirectory(directory) {
            directory.groups = GroupPlugin_1.getReflectionGroups(directory.getAllReflections());
            for (const dir of Object.values(directory.directories)) {
                walkDirectory(dir);
            }
        }
        const project = context.project;
        this.group(project);
        walkDirectory(project.directory);
        project.files.forEach((file) => {
            file.groups = GroupPlugin_1.getReflectionGroups(file.reflections);
        });
    }
    group(reflection) {
        var _a;
        const groups = [];
        if (reflection.isProject()) {
            const children = reflection.children || [];
            reflection.children = [];
            children
                .sort(GroupUtils.sortReferenceByName)
                .forEach((child) => {
                var _a;
                if (child.kindOf(models_1.ReflectionKind.SomeModule)) {
                    if (child.name == 'index' || child.name == 'global') {
                        // Exclude index direct submodule of project.
                        return;
                    }
                    const group = new models_1.ReflectionGroup(child.name, models_1.ReflectionKind.All);
                    GroupUtils.importIntoGroup(group, child, reflection, this.application.logger);
                    if (group.children.length > 0) {
                        // Sort imported child reflections, by name
                        group.children = group.children.sort(GroupUtils.sortReferenceByName);
                        groups.push(group);
                    }
                }
                else {
                    (_a = reflection.children) === null || _a === void 0 ? void 0 : _a.push(child);
                }
            });
            GroupUtils.pruneReferences(reflection);
        }
        if (reflection.children &&
            reflection.children.length > 0 &&
            !reflection.groups) {
            const groupedChildren = GroupUtils.getGroupsChildren(groups);
            reflection.children.sort(GroupPlugin_1.sortCallback);
            // Filter out children that have been grouped under modules.
            const childrenForGrouping = reflection
                .children
                .filter(child => !GroupUtils.hasChild(groupedChildren, child));
            reflection.groups = GroupPlugin_1.getReflectionGroups(childrenForGrouping);
        }
        reflection.groups = (_a = reflection.groups) === null || _a === void 0 ? void 0 : _a.concat(groups);
    }
    /**
     * Create a grouped representation of the given list of reflections.
     *
     * Reflections are grouped by kind and sorted by weight and name.
     *
     * @param reflections  The reflections that should be grouped.
     * @returns An array containing all children of the given reflection grouped by their kind.
     */
    static getReflectionGroups(reflections) {
        const groups = [];
        reflections.forEach((child) => {
            for (let i = 0; i < groups.length; i++) {
                const group = groups[i];
                if (group.kind !== child.kind) {
                    continue;
                }
                group.children.push(child);
                return;
            }
            const group = new models_1.ReflectionGroup(GroupPlugin_1.getKindPlural(child.kind), child.kind);
            group.children.push(child);
            groups.push(group);
        });
        groups.forEach((group) => {
            let allInherited = true;
            let allPrivate = true;
            let allProtected = true;
            let allExternal = true;
            group.children.forEach((child) => {
                allPrivate = child.flags.isPrivate && allPrivate;
                allProtected =
                    (child.flags.isPrivate || child.flags.isProtected) &&
                        allProtected;
                allExternal = child.flags.isExternal && allExternal;
                if (child instanceof models_1.DeclarationReflection) {
                    allInherited = !!child.inheritedFrom && allInherited;
                }
                else {
                    allInherited = false;
                }
            });
            group.allChildrenAreInherited = allInherited;
            group.allChildrenArePrivate = allPrivate;
            group.allChildrenAreProtectedOrPrivate = allProtected;
            group.allChildrenAreExternal = allExternal;
        });
        return groups;
    }
    /**
     * Transform the internal typescript kind identifier into a human readable version.
     *
     * @param kind  The original typescript kind identifier.
     * @returns A human readable version of the given typescript kind identifier.
     */
    static getKindString(kind) {
        let str = models_1.ReflectionKind[kind];
        str = str.replace(/(.)([A-Z])/g, (_m, a, b) => a + " " + b.toLowerCase());
        return str;
    }
    /**
     * Return the singular name of a internal typescript kind identifier.
     *
     * @param kind The original internal typescript kind identifier.
     * @returns The singular name of the given internal typescript kind identifier
     */
    static getKindSingular(kind) {
        if (kind in GroupPlugin_1.SINGULARS) {
            return GroupPlugin_1.SINGULARS[kind];
        }
        else {
            return GroupPlugin_1.getKindString(kind);
        }
    }
    /**
     * Return the plural name of a internal typescript kind identifier.
     *
     * @param kind The original internal typescript kind identifier.
     * @returns The plural name of the given internal typescript kind identifier
     */
    static getKindPlural(kind) {
        if (kind in GroupPlugin_1.PLURALS) {
            return GroupPlugin_1.PLURALS[kind];
        }
        else {
            return this.getKindString(kind) + "s";
        }
    }
    /**
     * Callback used to sort reflections by weight defined by ´GroupPlugin.WEIGHTS´ and name.
     *
     * @param a The left reflection to sort.
     * @param b The right reflection to sort.
     * @returns The sorting weight.
     */
    static sortCallback(a, b) {
        const aWeight = GroupPlugin_1.WEIGHTS.indexOf(a.kind);
        const bWeight = GroupPlugin_1.WEIGHTS.indexOf(b.kind);
        if (aWeight === bWeight) {
            if (a.flags.isStatic && !b.flags.isStatic) {
                return 1;
            }
            if (!a.flags.isStatic && b.flags.isStatic) {
                return -1;
            }
            if (a.name === b.name) {
                return 0;
            }
            return a.name > b.name ? 1 : -1;
        }
        else {
            return aWeight - bWeight;
        }
    }
};
/**
 * Define the sort order of reflections.
 */
GroupPlugin.WEIGHTS = [
    models_1.ReflectionKind.Project,
    models_1.ReflectionKind.Module,
    models_1.ReflectionKind.Namespace,
    models_1.ReflectionKind.Enum,
    models_1.ReflectionKind.EnumMember,
    models_1.ReflectionKind.Class,
    models_1.ReflectionKind.Interface,
    models_1.ReflectionKind.TypeAlias,
    models_1.ReflectionKind.Constructor,
    models_1.ReflectionKind.Event,
    models_1.ReflectionKind.Property,
    models_1.ReflectionKind.Variable,
    models_1.ReflectionKind.Function,
    models_1.ReflectionKind.Accessor,
    models_1.ReflectionKind.Method,
    models_1.ReflectionKind.ObjectLiteral,
    models_1.ReflectionKind.Parameter,
    models_1.ReflectionKind.TypeParameter,
    models_1.ReflectionKind.TypeLiteral,
    models_1.ReflectionKind.CallSignature,
    models_1.ReflectionKind.ConstructorSignature,
    models_1.ReflectionKind.IndexSignature,
    models_1.ReflectionKind.GetSignature,
    models_1.ReflectionKind.SetSignature,
];
/**
 * Define the singular name of individual reflection kinds.
 */
GroupPlugin.SINGULARS = {
    [models_1.ReflectionKind.Enum]: "Enumeration",
    [models_1.ReflectionKind.EnumMember]: "Enumeration member",
};
/**
 * Define the plural name of individual reflection kinds.
 */
GroupPlugin.PLURALS = {
    [models_1.ReflectionKind.Class]: "Classes",
    [models_1.ReflectionKind.Property]: "Properties",
    [models_1.ReflectionKind.Enum]: "Enumerations",
    [models_1.ReflectionKind.EnumMember]: "Enumeration members",
    [models_1.ReflectionKind.TypeAlias]: "Type aliases",
};
GroupPlugin = GroupPlugin_1 = __decorate([
    components_1.Component({ name: "jekyll-sketch-group" })
], GroupPlugin);
exports.GroupPlugin = GroupPlugin;
