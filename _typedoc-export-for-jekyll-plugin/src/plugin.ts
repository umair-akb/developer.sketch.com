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

    this.listenTo(this.owner, PageEvent.END, this.onRendererEndPage, 1000);
  }
  /**
   * Triggered after a document has been rendered, just before it is written to disc.
   *
   * @param page  An event object describing the current render operation.
   */
  private onRendererEndPage(event) {
    const title = event.project.name
    // TODO: Build header dynamically by case
    event.contents = `
---
title: ${title}
section: assistants
permalink: /assistants/reference/types/modules
chapter: Reference
excerpt: Sketch Assistants type reference.
---

` + event.contents
  }
}