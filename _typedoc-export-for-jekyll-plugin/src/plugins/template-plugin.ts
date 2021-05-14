import { Component, RendererComponent } from 'typedoc/dist/lib/output/components';
import { ReflectionKind } from 'typedoc/dist/lib/models';
import { PageEvent } from 'typedoc/dist/lib/output/events';
import { LogLevel } from 'typedoc/dist/lib/utils';
import { writeFileSync } from 'fs'
import { inspect } from 'util'
/**
 * A plugin that wraps the generated output with a layout template.
 *
 * Currently only a default layout is supported. The layout must be stored
 * as ´layouts/default.hbs´ in the theme directory.
 */
export class TemplatePlugin extends RendererComponent {
  /**
   * Create a new TemplatePlugin instance.
   */
  initialize() {
    this.listenTo(this.owner, PageEvent.BEGIN, this.onRendererBeginPage, 1500);
    this.listenTo(this.owner, PageEvent.END, this.onRendererEndPage, 1000);
  }
  /**
   * Triggered after a document has been rendered, just before it is written to disc.
   *
   * @param page  An event object describing the current render operation.
   */
  private onRendererEndPage(event) {
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

` + event.contents
  }

  private onRendererBeginPage(event) {
  }

  private getKindChapter(reflection) {
    if (reflection && reflection.kind) {
      switch (reflection.kind) {
        case ReflectionKind.Project:
          return reflection.name;
        case ReflectionKind.Enum:
          return "enums";
        case ReflectionKind.Module:
          return "modules";
        default:
          return "";
      }
    } else {
      return "";
    }
  }

  private getPermalink(model) {
    return [
      "reference",
      this.getKindChapter(model.parent),
      this.getKindChapter(model),
      this.nameToUrl(model.name)
    ].filter((v) => !!v).join("/");
  }

  private getChapter(model) {
    return [
      "Reference",
      this.titleCaseWord(this.getKindChapter(model.parent)),
      this.titleCaseWord(this.getKindChapter(model))
    ].filter((v) => !!v).join("/");
  }

  private titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1);
  }

  private nameToUrl(word: string) {
    if (!word) return word;
    return word.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
}