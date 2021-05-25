import { BindOption } from 'typedoc';
import MarkdownTheme from 'typedoc-plugin-markdown/dist/theme';
import { ContextAwareHelpers } from 'typedoc-plugin-markdown/dist/components/options';
import { Renderer } from 'typedoc/dist/lib/output/renderer';
import {
  DeclarationReflection,
  Reflection
} from 'typedoc/dist/lib/models';

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

  /**
   * Similar to DefaultTheme.applyAnchorUrl method with added but the anchors are computed from the reflection structure
   * Generate an anchor url for the given reflection and all of its children.
   *
   * @param reflection  The reflection an anchor url should be created for.
   * @param container   The nearest reflection having an own document.
   */
  applyAnchorUrl(reflection: Reflection, container: Reflection) {
    if (!reflection.url || !MarkdownTheme.URL_PREFIX.test(reflection.url)) {
      const reflectionId = reflection.name.toLowerCase();
      const anchor = this.toAnchorRef(reflectionId);
      reflection.url = '#' + anchor;
      reflection.anchor = anchor;
      reflection.hasOwnDocument = false;
    }
    reflection.traverse((child) => {
      if (child instanceof DeclarationReflection) {
        this.applyAnchorUrl(child, container);
      }
    });
  }
}