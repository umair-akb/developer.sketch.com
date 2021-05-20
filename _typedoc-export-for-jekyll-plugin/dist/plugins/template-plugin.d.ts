import { RendererComponent } from 'typedoc/dist/lib/output/components';
/**
 * A plugin that wraps the generated output with a layout template.
 *
 * Currently only a default layout is supported. The layout must be stored
 * as ´layouts/default.hbs´ in the theme directory.
 */
export declare class TemplatePlugin extends RendererComponent {
    /**
     * Create a new TemplatePlugin instance.
     */
    initialize(): void;
    /**
     * Triggered after a document has been rendered, just before it is written to disc.
     *
     * @param page  An event object describing the current render operation.
     */
    private onRendererPageEnd;
    private onRendererPageBegin;
    private getExcerpt;
    private getPermalink;
    private getKindChapter;
    private getProject;
    private getChaptersArray;
    private getChapter;
}
