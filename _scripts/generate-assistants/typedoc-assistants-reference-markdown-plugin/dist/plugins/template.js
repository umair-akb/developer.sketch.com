"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatePlugin = void 0;
const typedoc_1 = require("typedoc");
const components_1 = require("typedoc/dist/lib/output/components");
const events_1 = require("typedoc/dist/lib/output/events");
const urls_1 = require("../util/urls");
const strings_1 = require("../util/strings");
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
        this.listenTo(this.owner, events_1.PageEvent.BEGIN, this.onRendererPageBegin, 1);
        this.listenTo(this.owner, events_1.PageEvent.END, this.onRendererPageEnd, 1000);
    }
    /**
     * Triggered after a document has been rendered, just before it is written to disc.
     *
     * @param page  An event object describing the current render operation.
     */
    onRendererPageEnd(pageEvent) {
        const title = pageEvent.model.name;
        const chapter = this.getChapter(pageEvent.model, 'Reference');
        const permalink = pageEvent.permalink;
        const excerpt = this.getExcerpt(pageEvent.model);
        const definitions = pageEvent.definitions;
        pageEvent.contents = `---
title: ${title}
section: assistants
permalink: /assistants/reference/${permalink}
chapter: ${chapter}
excerpt: ${excerpt}
order: 505
definitions: ${definitions}
---

` + pageEvent.contents;
    }
    onRendererPageBegin(pageEvent) {
        // This is where we should compute the permalink
        // for the Jekyll header.
        pageEvent.permalink = this.getPermalink(pageEvent.url, pageEvent.model);
        pageEvent.definitions = this.getProjectLinks(pageEvent.model);
        return pageEvent;
    }
    getExcerpt(reflection) {
        if (reflection.comment) {
            return reflection.comment.shortText;
        }
        else {
            return reflection.name;
        }
    }
    getPermalink(url, reflection) {
        const project = this.getProject(reflection);
        const projectSlug = (project && project !== reflection ? project.getAlias() + '/' : '');
        return projectSlug + urls_1.stripMdExt(url);
    }
    getKindChapter(reflection) {
        if (!reflection) {
            return null;
        }
        if (reflection.isProject()) {
            return strings_1.toTitleCase(reflection.name);
        }
        switch (reflection.kind) {
            case typedoc_1.ReflectionKind.Enum:
                return 'Enums';
            case typedoc_1.ReflectionKind.Module:
            case typedoc_1.ReflectionKind.Namespace:
                return 'Modules';
            default:
                return null;
        }
    }
    getProject(model) {
        if (!model) {
            return null;
        }
        if (model.isProject()) {
            return model;
        }
        else {
            return this.getProject(model.parent);
        }
    }
    getChaptersArray(reflection) {
        if (reflection) {
            let chapters = [];
            if (!reflection.isProject()) {
                const chapter = this.getKindChapter(reflection);
                chapters = this.getChaptersArray(reflection.parent);
                if (chapter) {
                    chapters.push(chapter);
                }
                chapters = chapters.filter((v) => !!v);
            }
            return chapters;
        }
        return [];
    }
    getChapter(reflection, rootChapter = '') {
        if (reflection) {
            let rootChapters = [rootChapter];
            const project = (reflection.isProject() ? null : this.getProject(reflection));
            if (project) {
                const projectChapter = this.getKindChapter(project);
                if (projectChapter) {
                    rootChapters.push(projectChapter);
                }
            }
            let chapters = rootChapters.concat(this.getChaptersArray(reflection));
            return chapters.join('/');
        }
        return rootChapter;
    }
    getProjectLinks(project) {
        const groups = project.groups || [];
        return groups
            .map(group => this.getGroupLinks(group))
            .join('|||');
    }
    getGroupLinks(group) {
        return [group.title, this.getGroupChildren(group)].join('||');
    }
    getGroupChildren(group) {
        return group
            .children
            .map(child => [child.name, urls_1.stripMdExt(child.url)].join(';'))
            .join('|');
    }
}
exports.TemplatePlugin = TemplatePlugin;
