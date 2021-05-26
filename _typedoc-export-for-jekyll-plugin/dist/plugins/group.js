"use strict";
// import {
//   Reflection,
//   ReflectionKind,
//   ContainerReflection,
//   DeclarationReflection,
//   ReflectionGroup,
//   SourceDirectory
// } from "typedoc/dist/lib/models";
// import { Component, ConverterComponent } from "typedoc/dist/lib/converter/components";
// import { Converter, Context } from "typedoc/dist/lib/converter";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SketchGroupPlugin = void 0;
const components_1 = require("typedoc/dist/lib/converter/components");
const plugins_1 = require("typedoc/dist/lib/converter/plugins");
/**
* A handler that sorts and groups the found reflections in the resolving phase.
*
* The handler sets the ´groups´ property of all reflections.
*/
let SketchGroupPlugin = class SketchGroupPlugin extends plugins_1.GroupPlugin {
};
SketchGroupPlugin = __decorate([
    components_1.Component({ name: "sketch-group" })
], SketchGroupPlugin);
exports.SketchGroupPlugin = SketchGroupPlugin;
