import * as fs from 'fs-extra';
import {
  BindOption,
  DeclarationReflection,
  NavigationItem,
  ProjectReflection,
  Reflection,
} from 'typedoc';
import MarkdownTheme from 'typedoc-plugin-markdown/dist/theme';
import { GroupPlugin } from 'typedoc/dist/lib/converter/plugins';
import { RendererEvent } from 'typedoc/dist/lib/output/events';
import { Renderer } from 'typedoc/dist/lib/output/renderer';
import { TemplateMapping } from 'typedoc/dist/lib/output/themes/DefaultTheme';

export default class SketchCustomTheme extends MarkdownTheme {
  renderer: Renderer;
  @BindOption('entryPoints')
  entryPoints!: string[];
  @BindOption('readme')
  readme!: string;

  constructor(renderer: Renderer, basePath: string) {
    super(renderer, basePath);
    this.renderer = renderer;
    this.renderer.application.options.setValue('entryDocument', 'module.md');
    this.renderer.application.options.setValue('hideBreadcrumbs', true);
    this.renderer.application.options.setValue('hidePageTitle', true);
    // this.listenTo(renderer, RendererEvent.END, this.onRendererEnd, 1024);
  }

  // getUrls(project: ProjectReflection) {
  //   return super.getUrls(project).map((urlMapping) => {
  //     if (this.readme !== 'none' && project.url === urlMapping.url) {
  //       return {
  //         ...urlMapping,
  //         url: this.entryPoints.length > 1 ? 'modules.md' : 'exports.md',
  //       };
  //     }
  //     return urlMapping;
  //   });
  // }

  // toUrl(mapping: TemplateMapping, reflection: DeclarationReflection) {
  //   const dir = `${GroupPlugin.getKindSingular(reflection.kind)}s`
  //   return `${dir}/${this.getUrl(
  //     reflection,
  //   )}.md`;
  // }

  // getUrl(reflection: Reflection): string {
  //   const url = reflection.name;
  //   return url;
  // }

  // onRendererEnd(renderer: RendererEvent) {
  // }
}