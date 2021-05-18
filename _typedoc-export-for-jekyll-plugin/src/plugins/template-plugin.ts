import { RendererComponent } from 'typedoc/dist/lib/output/components';
import { ReflectionKind } from 'typedoc/dist/lib/models';
import { PageEvent } from 'typedoc/dist/lib/output/events';
import { stripMdExt } from '../util/urls';
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
    this.listenTo(this.owner, PageEvent.BEGIN, this.onRendererPageBegin);
    this.listenTo(this.owner, PageEvent.END, this.onRendererPageEnd, 1000);
  }


  /**
   * Triggered after a document has been rendered, just before it is written to disc.
   *
   * @param page  An event object describing the current render operation.
   */
  private onRendererPageEnd(pageEvent) {
    const title = pageEvent.model.name;
    // TODO: Build header dynamically by case
    const chapter = this.getChapter(pageEvent.model);
    // const permalink = this.getPermalink(pageEvent.model);
    const permalink = pageEvent.permalink;

    pageEvent.contents = `---
title: ${title}
section: assistants
permalink: /assistants/${permalink}
chapter: ${chapter}
excerpt: Sketch Assistants type reference.
---

` + pageEvent.contents
  }

  private onRendererPageBegin(pageEvent) {
    // This is where we should compute the permalink
    // for the Jekyll header.

    pageEvent.permalink = stripMdExt(pageEvent.url);
    return pageEvent;
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
}