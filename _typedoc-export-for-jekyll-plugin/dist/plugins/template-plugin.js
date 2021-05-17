"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatePlugin = void 0;
const components_1 = require("typedoc/dist/lib/output/components");
const models_1 = require("typedoc/dist/lib/models");
const events_1 = require("typedoc/dist/lib/output/events");
const urls_1 = require("../util/urls");
/**
 * A plugin that wraps the generated output with a layout template.
 *
 * Currently only a default layout is supported. The layout must be stored
 * as ´layouts/default.hbs´ in the theme directory.
 */
class TemplatePlugin extends components_1.RendererComponent {
    /**
     * Create a new TemplatePlugin instance.
     */
    initialize() {
        this.listenTo(this.owner, events_1.PageEvent.BEGIN, this.onRendererBeginPage, 1500);
        this.listenTo(this.owner, events_1.PageEvent.END, this.onRendererEndPage, 1000);
    }
    /**
     * Triggered after a document has been rendered, just before it is written to disc.
     *
     * @param page  An event object describing the current render operation.
     */
    onRendererEndPage(event) {
        const title = event.model.name;
        // TODO: Build header dynamically by case
        const chapter = this.getChapter(event.model);
        const permalink = this.getPermalink(event.model);
        event.contents = `---
title: ${title}
section: assistants
permalink: /assistants/${permalink}
chapter: ${chapter}
excerpt: Sketch Assistants type reference.
---

` + event.contents;
    }
    onRendererBeginPage(event) {
    }
    getKindChapter(reflection) {
        if (reflection && reflection.kind) {
            switch (reflection.kind) {
                case models_1.ReflectionKind.Project:
                    return reflection.name;
                case models_1.ReflectionKind.Enum:
                    return "enums";
                case models_1.ReflectionKind.Module:
                    return "modules";
                default:
                    return "";
            }
        }
        else {
            return "";
        }
    }
    getPermalink(model) {
        return [
            "reference",
            this.getKindChapter(model.parent),
            this.getKindChapter(model),
            urls_1.urlFriendlyName(model.name)
        ].filter((v) => !!v).join("/");
    }
    getChapter(model) {
        return [
            "Reference",
            this.titleCaseWord(this.getKindChapter(model.parent)),
            this.titleCaseWord(this.getKindChapter(model))
        ].filter((v) => !!v).join("/");
    }
    titleCaseWord(word) {
        if (!word)
            return word;
        return word[0].toUpperCase() + word.substr(1);
    }
}
exports.TemplatePlugin = TemplatePlugin;
