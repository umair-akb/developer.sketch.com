"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConverterPlugin = void 0;
const path = require("path");
const typedoc_1 = require("typedoc");
const converter_1 = require("typedoc/dist/lib/converter");
const components_1 = require("typedoc/dist/lib/converter/components");
const models_1 = require("typedoc/dist/lib/models");
const util_1 = require("util");
let ConverterPlugin = class ConverterPlugin extends components_1.ConverterComponent {
    initialize() {
        // This has to be -1 priority to run first and set the `getDefaultTheme` static function.
        this.listenTo(this.owner, converter_1.Converter.EVENT_BEGIN, this.onConverterBegin, -1);
        this.listenTo(this.owner, converter_1.Converter.EVENT_RESOLVE_BEGIN, this.onResolveBegin);
        // This has to be priority -300 to run before the TypeDoc GroupPlugin runs (which has priority -200)
        // so that we can capture children before they're moved into groups.
        this.listenTo(this.owner, converter_1.Converter.EVENT_RESOLVE_BEGIN, this.mergeChildReferences, -300);
    }
    /**
     * Overide default assets
     */
    onConverterBegin(context) {
        const getDefaultTheme = () => path.join(__dirname, '../theme/resources');
        typedoc_1.Renderer.getDefaultTheme = getDefaultTheme;
        this.application.renderer.getDefaultTheme = getDefaultTheme;
    }
    /**
     * Fetches all child reflections and merges them into the project,
     * so that the modular hierarchy based on Module and Namespace reflections
     * is discarded.
     *
     * Note: this must run before any grouping occurs (TypeDoc / GroupPlugin)
     */
    mergeChildReferences(context) {
        const project = context.project;
        const children = project.children;
        project.children = [];
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child.name == 'run/profile') {
                this.application.logger.log(util_1.inspect(child));
            }
            this.importReflections(child, project);
        }
        // At the end of importing all children,
        // Reference reflections have also been imported into the project children.
        // Remove any references that are directly listed as project children,
        // to avoid duplicates.
        this.pruneReferences(project);
    }
    onResolveBegin(context) {
        const themeDir = path.join(__dirname, '../theme');
        // Set the default markdown theme
        this.application.options.setValue('theme', themeDir);
    }
    importReflections(source, target) {
        if (source.kindOf(models_1.ReflectionKind.SomeModule)) {
            source.traverse((child) => {
                this.importReflections(child, target);
            });
            source.children = [];
        }
        else {
            this.importReflection(source, target);
        }
    }
    importReflection(source, target) {
        var _a;
        source.parent = target;
        (_a = target.children) === null || _a === void 0 ? void 0 : _a.push(source);
    }
    pruneReferences(project) {
        const nonReferenceReflections = project
            .getChildrenByKind(models_1.ReflectionKind.All ^ models_1.ReflectionKind.Reference);
        project
            .getChildrenByKind(models_1.ReflectionKind.Reference)
            .forEach((ref) => {
            var _a, _b;
            if (nonReferenceReflections.find(ref => ref.name == ref.name)) {
                const idx = (_a = project.children) === null || _a === void 0 ? void 0 : _a.findIndex(child => child.id == ref.id);
                if (idx != undefined && idx >= 0) {
                    (_b = project.children) === null || _b === void 0 ? void 0 : _b.splice(idx, 1);
                }
            }
        });
    }
};
__decorate([
    typedoc_1.BindOption('theme')
], ConverterPlugin.prototype, "theme", void 0);
ConverterPlugin = __decorate([
    components_1.Component({ name: 'jekyll-sketch-converter' })
], ConverterPlugin);
exports.ConverterPlugin = ConverterPlugin;
