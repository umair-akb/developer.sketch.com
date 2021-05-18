import MarkdownTheme from 'typedoc-plugin-markdown/dist/theme';
import { Renderer } from 'typedoc/dist/lib/output/renderer';
export default class SketchCustomTheme extends MarkdownTheme {
    renderer: Renderer;
    entryPoints: string[];
    readme: string;
    static HANDLEBARS: typeof Handlebars;
    static URL_PREFIX: RegExp;
    constructor(renderer: Renderer, basePath: string);
}
