import { DeclarationReflection, Reflection, Renderer, UrlMapping } from 'typedoc';
import { TemplateMapping } from 'typedoc/dist/lib/output/themes/DefaultTheme';
import MarkdownTheme from 'typedoc-plugin-markdown/dist/theme';
export default class SketchCustomTheme extends MarkdownTheme {
    renderer: Renderer;
    entryPoints: string[];
    readme: string;
    static HANDLEBARS: typeof Handlebars;
    static URL_PREFIX: RegExp;
    constructor(renderer: Renderer, basePath: string);
    /**
     * Test if directory is output directory
     * @param outputDirectory
     */
    isOutputDirectory(outputDirectory: string): boolean;
    /**
     * Similar to DefaultTheme.applyAnchorUrl method with added but the anchors are computed from the reflection structure
     * Generate an anchor url for the given reflection and all of its children.
     *
     * @param reflection  The reflection an anchor url should be created for.
     * @param container   The nearest reflection having an own document.
     */
    applyAnchorUrl(reflection: Reflection, container: Reflection): void;
    /**
     * This is mostly a copy of the TypeDoc DefaultTheme.buildUrls method with .html ext switched to .md
     * Builds the url for the the given reflection and all of its children.
     *
     * @param reflection  The reflection the url should be created for.
     * @param urls The array the url should be appended to.
     * @returns The altered urls array.
     */
    buildUrls(reflection: DeclarationReflection, urls: UrlMapping[]): UrlMapping[];
    get mappings(): TemplateMapping[];
}
