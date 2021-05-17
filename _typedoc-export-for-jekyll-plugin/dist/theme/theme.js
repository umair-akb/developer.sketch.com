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
        this.renderer.application.options.setValue('entryDocument', 'module.md');
        this.renderer.application.options.setValue('hideBreadcrumbs', true);
        this.renderer.application.options.setValue('hidePageTitle', true);
        // this.listenTo(renderer, RendererEvent.END, this.onRendererEnd, 1024);
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
            // const reflectionId = reflection.name.toLowerCase();
            const reflectionId = urls_1.urlFriendlyName(reflection.name);
            const anchor = this.toAnchorRef(reflectionId);
            reflection.url = '#' + anchor;
            reflection.anchor = anchor;
            reflection.hasOwnDocument = false;
        }
        reflection.traverse((child) => {
            if (child instanceof typedoc_1.DeclarationReflection) {
                this.applyAnchorUrl(child, container);
            }
        });
    }
    // getUrls(project: ProjectReflection) {
    //   return super.getUrls(project).map((urlMapping) => {
    //     if (this.readme !== 'none' && project.url === urlMapping.url) {
    //       return {
    //         ...urlMapping,
    //         url: this.entryPoints.length > 1 ? 'modules.md' : 'exports.md',
    //       };
    //     }
    //     return urlMapping;
    //   });
    // }
    /**
       * Returns the full url of a given mapping and reflection
       * @param mapping
       * @param reflection
       */
    toUrl(mapping, reflection) {
        return mapping.directory + '/' + this.getUrl(reflection);
    }
    /**
     * @see DefaultTheme.getUrl
     * Return a url for the given reflection.
     *
     * @param reflection  The reflection the url should be generated for.
     * @param relative    The parent reflection the url generation should stop on.
     * @param separator   The separator used to generate the url.
     * @returns           The generated url.
     */
    getUrl(reflection, relative) {
        // let url = urlFriendlyName(reflection.name);
        // if (
        //   reflection.parent &&
        //   reflection.parent !== relative &&
        //   !(reflection.parent instanceof ProjectReflection)
        // ) {
        //   url =
        //     this.getUrl(reflection.parent, relative) + this.filenameSeparator + url;
        // }
        // return url;
        return urls_1.urlFriendlyName(reflection.name);
    }
    // onRendererEnd(renderer: RendererEvent) {
    // }
    get mappings() {
        return [
            {
                kind: [models_1.ReflectionKind.Module],
                isLeaf: false,
                directory: 'modules',
                template: 'reflection.hbs',
            },
            {
                kind: [models_1.ReflectionKind.Namespace],
                isLeaf: false,
                directory: 'modules',
                template: 'reflection.hbs',
            },
            {
                kind: [models_1.ReflectionKind.Enum],
                isLeaf: true,
                directory: 'enumsxx',
                template: 'reflection.hbs',
            },
            {
                kind: [models_1.ReflectionKind.Class],
                isLeaf: false,
                directory: 'classes',
                template: 'reflection.hbs',
            },
            {
                kind: [models_1.ReflectionKind.Interface],
                isLeaf: false,
                directory: 'interfaces',
                template: 'reflection.hbs',
            },
            ...(this.allReflectionsHaveOwnDocument
                ? [
                    {
                        kind: [models_1.ReflectionKind.TypeAlias],
                        isLeaf: true,
                        directory: 'types',
                        template: 'reflection.member.hbs',
                    },
                    {
                        kind: [models_1.ReflectionKind.Variable],
                        isLeaf: true,
                        directory: 'variables',
                        template: 'reflection.member.hbs',
                    },
                    {
                        kind: [models_1.ReflectionKind.Function],
                        isLeaf: true,
                        directory: 'functions',
                        template: 'reflection.member.hbs',
                    },
                ]
                : []),
        ];
    }
}
__decorate([
    typedoc_1.BindOption('entryPoints')
], SketchCustomTheme.prototype, "entryPoints", void 0);
__decorate([
    typedoc_1.BindOption('readme')
], SketchCustomTheme.prototype, "readme", void 0);
exports.default = SketchCustomTheme;
