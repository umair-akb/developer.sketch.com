import { BindOption } from 'typedoc';
import MarkdownTheme from 'typedoc-plugin-markdown/dist/theme';
import { ContextAwareHelpers } from 'typedoc-plugin-markdown/dist/components/options';
import { Renderer } from 'typedoc/dist/lib/output/renderer';

import { stripMdExt } from '../util/urls';
export default class SketchCustomTheme extends MarkdownTheme {
  renderer: Renderer;
  @BindOption('entryPoints')
  entryPoints!: string[];
  @BindOption('readme')
  readme!: string;

  static HANDLEBARS = MarkdownTheme.HANDLEBARS;

  static URL_PREFIX = MarkdownTheme.URL_PREFIX;

  constructor(renderer: Renderer, basePath: string) {
    super(renderer, basePath);
    this.renderer = renderer;
    this.renderer.application.options.setValue('entryDocument', 'module.md');
    this.renderer.application.options.setValue('hideBreadcrumbs', true);
    this.renderer.application.options.setValue('hidePageTitle', true);

    // utility helper
    const mdOptions: ContextAwareHelpers = <ContextAwareHelpers>this.renderer.getComponent('options');

    SketchCustomTheme.HANDLEBARS.unregisterHelper('relativeURL');
    SketchCustomTheme.HANDLEBARS.registerHelper('relativeURL', (url: string) => {
      let relative_url = url
        ? mdOptions.publicPath
          ? mdOptions.publicPath + url
          : mdOptions.getRelativeUrl(url)
        : url;

      return stripMdExt(relative_url);
    });
  }
}