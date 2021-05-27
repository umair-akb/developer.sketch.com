import MarkdownTheme from 'typedoc-plugin-markdown/dist/theme';
import { Renderer } from 'typedoc/dist/lib/output/renderer';
import { Reflection, ReflectionKind } from 'typedoc/dist/lib/models';
declare type Mapping = {
    kind: ReflectionKind[];
    isLeaf: boolean;
    directory: string;
    template: string;
};
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
    get mappings(): Mapping[];
}
export {};
