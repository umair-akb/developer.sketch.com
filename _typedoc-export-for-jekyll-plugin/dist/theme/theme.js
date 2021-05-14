var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "typedoc", "typedoc-plugin-markdown/dist/theme"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const typedoc_1 = require("typedoc");
    const theme_1 = require("typedoc-plugin-markdown/dist/theme");
    class SketchCustomTheme extends theme_1.default {
        constructor(renderer, basePath) {
            super(renderer, basePath);
            this.renderer = renderer;
            this.renderer.application.options.setValue('entryDocument', 'module.md');
            this.renderer.application.options.setValue('hideBreadcrumbs', true);
            this.renderer.application.options.setValue('hidePageTitle', true);
            // this.listenTo(renderer, RendererEvent.END, this.onRendererEnd, 1024);
        }
    }
    __decorate([
        typedoc_1.BindOption('entryPoints')
    ], SketchCustomTheme.prototype, "entryPoints", void 0);
    __decorate([
        typedoc_1.BindOption('readme')
    ], SketchCustomTheme.prototype, "readme", void 0);
    exports.default = SketchCustomTheme;
});
