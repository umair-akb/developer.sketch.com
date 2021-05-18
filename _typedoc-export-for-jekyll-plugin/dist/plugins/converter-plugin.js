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
class ConverterPlugin extends components_1.ConverterComponent {
    initialize() {
        this.listenTo(this.owner, converter_1.Converter.EVENT_BEGIN, this.onConverterBegin, 1000);
    }
    /**
     * Overide default assets
     */
    onConverterBegin() {
        typedoc_1.Renderer.getDefaultTheme = () => path.join(__dirname, '../theme/resources');
    }
}
__decorate([
    typedoc_1.BindOption('theme')
], ConverterPlugin.prototype, "theme", void 0);
exports.ConverterPlugin = ConverterPlugin;
