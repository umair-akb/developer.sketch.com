import { DeclarationReflection, Reflection } from 'typedoc';
import MarkdownTheme from 'typedoc-plugin-markdown/dist/theme';
import { ReflectionKind } from 'typedoc/dist/lib/models';
import { Renderer } from 'typedoc/dist/lib/output/renderer';
import { TemplateMapping } from 'typedoc/dist/lib/output/themes/DefaultTheme';
export default class SketchCustomTheme extends MarkdownTheme {
    renderer: Renderer;
    entryPoints: string[];
    readme: string;
    constructor(renderer: Renderer, basePath: string);
    /**
     * Similar to DefaultTheme.applyAnchorUrl method with added but the anchors are computed from the reflection structure
     * Generate an anchor url for the given reflection and all of its children.
     *
     * @param reflection  The reflection an anchor url should be created for.
     * @param container   The nearest reflection having an own document.
     */
    applyAnchorUrl(reflection: Reflection, container: Reflection): void;
    /**
       * Returns the full url of a given mapping and reflection
       * @param mapping
       * @param reflection
       */
    toUrl(mapping: TemplateMapping, reflection: DeclarationReflection): string;
    /**
     * @see DefaultTheme.getUrl
     * Return a url for the given reflection.
     *
     * @param reflection  The reflection the url should be generated for.
     * @param relative    The parent reflection the url generation should stop on.
     * @param separator   The separator used to generate the url.
     * @returns           The generated url.
     */
    getUrl(reflection: Reflection, relative?: Reflection): string;
    get mappings(): {
        kind: ReflectionKind[];
        isLeaf: boolean;
        directory: string;
        template: string;
    }[];
}
