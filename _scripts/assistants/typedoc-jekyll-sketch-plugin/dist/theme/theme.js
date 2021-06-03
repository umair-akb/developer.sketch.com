"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedoc_1 = require("typedoc");
const theme_1 = require("typedoc-plugin-markdown/dist/theme");
const models_1 = require("typedoc/dist/lib/models");
const urls_1 = require("../util/urls");
class SketchCustomTheme extends theme_1.default {
    constructor(renderer, basePath) {
        super(renderer, basePath);
        this.renderer = renderer;
        this.renderer.application.options.setValue('hideBreadcrumbs', true);
        this.renderer.application.options.setValue('hidePageTitle', true);
        // utility helper
        const mdOptions = this.renderer.getComponent('options');
        SketchCustomTheme.HANDLEBARS.unregisterHelper('relativeURL');
        SketchCustomTheme.HANDLEBARS.registerHelper('relativeURL', (url) => {
            let relative_url = url
                ? mdOptions.publicPath
                    ? mdOptions.publicPath + url
                    : mdOptions.getRelativeUrl(url)
                : url;
            return urls_1.stripMdExt(relative_url);
        });
    }
    /**
     * Test if directory is output directory
     * @param outputDirectory
     */
    isOutputDirectory(outputDirectory) {
        return true;
    }
    /**
     * Similar to DefaultTheme.applyAnchorUrl method with added but the anchors are computed from the reflection structure
     * Generate an anchor url for the given reflection and all of its children.
     *
     * @param reflection  The reflection an anchor url should be created for.
     * @param container   The nearest reflection having an own document.
     */
    applyAnchorUrl(reflection, container) {
        if (!reflection.url || !theme_1.default.URL_PREFIX.test(reflection.url)) {
            const reflectionId = reflection.name.toLowerCase();
            const anchor = this.toAnchorRef(reflectionId);
            if (reflection.kindOf(models_1.ReflectionKind.EnumMember)) {
                reflection.url = container.url + '-' + anchor;
            }
            else {
                reflection.url = '#' + anchor;
            }
            reflection.anchor = anchor;
            reflection.hasOwnDocument = false;
        }
        reflection.traverse((child) => {
            if (child instanceof models_1.DeclarationReflection) {
                this.applyAnchorUrl(child, container);
            }
        });
    }
    /**
     * This is mostly a copy of the TypeDoc DefaultTheme.buildUrls method with .html ext switched to .md
     * Builds the url for the the given reflection and all of its children.
     *
     * @param reflection  The reflection the url should be created for.
     * @param urls The array the url should be appended to.
     * @returns The altered urls array.
     */
    buildUrls(reflection, urls) {
        const mapping = this.mappings.find((mapping) => reflection.kindOf(mapping.kind));
        if (mapping) {
            if (!reflection.url || !theme_1.default.URL_PREFIX.test(reflection.url)) {
                const url = this.toUrl(mapping, reflection);
                urls.push(new typedoc_1.UrlMapping(url, reflection, mapping.template));
                reflection.url = url;
                reflection.hasOwnDocument = true;
            }
            for (const child of reflection.children || []) {
                if (mapping.isLeaf) {
                    this.applyAnchorUrl(child, reflection);
                }
                else {
                    this.buildUrls(child, urls);
                }
            }
        }
        else if (reflection.parent) {
            this.applyAnchorUrl(reflection, reflection.parent);
        }
        return urls;
    }
    get mappings() {
        return [];
    }
}
SketchCustomTheme.HANDLEBARS = theme_1.default.HANDLEBARS;
SketchCustomTheme.URL_PREFIX = theme_1.default.URL_PREFIX;
__decorate([
    typedoc_1.BindOption('entryPoints')
], SketchCustomTheme.prototype, "entryPoints", void 0);
__decorate([
    typedoc_1.BindOption('readme')
], SketchCustomTheme.prototype, "readme", void 0);
exports.default = SketchCustomTheme;
