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
import { ReflectionKind } from 'typedoc/dist/lib/models';
import { RendererEvent } from 'typedoc/dist/lib/output/events';
import { Renderer } from 'typedoc/dist/lib/output/renderer';
import { TemplateMapping } from 'typedoc/dist/lib/output/themes/DefaultTheme';

import { urlFriendlyName } from '../util/urls';
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


  /**
   * Similar to DefaultTheme.applyAnchorUrl method with added but the anchors are computed from the reflection structure
   * Generate an anchor url for the given reflection and all of its children.
   *
   * @param reflection  The reflection an anchor url should be created for.
   * @param container   The nearest reflection having an own document.
   */
  applyAnchorUrl(reflection: Reflection, container: Reflection) {
    if (!reflection.url || !MarkdownTheme.URL_PREFIX.test(reflection.url)) {
      // const reflectionId = reflection.name.toLowerCase();
      const reflectionId = urlFriendlyName(reflection.name);
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

  /**
     * Returns the full url of a given mapping and reflection
     * @param mapping
     * @param reflection
     */
  toUrl(mapping: TemplateMapping, reflection: DeclarationReflection) {
    return mapping.directory + '/' + this.getUrl(reflection);
  }

  /**
   * @see DefaultTheme.getUrl
   * Return a url for the given reflection.
   *
   * @param reflection  The reflection the url should be generated for.
   * @param relative    The parent reflection the url generation should stop on.
   * @param separator   The separator used to generate the url.
   * @returns           The generated url.
   */
  getUrl(reflection: Reflection, relative?: Reflection): string {
    // let url = urlFriendlyName(reflection.name);

    // if (
    //   reflection.parent &&
    //   reflection.parent !== relative &&
    //   !(reflection.parent instanceof ProjectReflection)
    // ) {
    //   url =
    //     this.getUrl(reflection.parent, relative) + this.filenameSeparator + url;
    // }

    // return url;
    return urlFriendlyName(reflection.name);
  }

  // onRendererEnd(renderer: RendererEvent) {
  // }
  get mappings() {
    return [
      {
        kind: [ReflectionKind.Module],
        isLeaf: false,
        directory: 'modules',
        template: 'reflection.hbs',
      },
      {
        kind: [ReflectionKind.Namespace],
        isLeaf: false,
        directory: 'modules',
        template: 'reflection.hbs',
      },
      {
        kind: [ReflectionKind.Enum],
        isLeaf: true,
        directory: 'enumsxx',
        template: 'reflection.hbs',
      },
      {
        kind: [ReflectionKind.Class],
        isLeaf: false,
        directory: 'classes',
        template: 'reflection.hbs',
      },
      {
        kind: [ReflectionKind.Interface],
        isLeaf: false,
        directory: 'interfaces',
        template: 'reflection.hbs',
      },
      ...(this.allReflectionsHaveOwnDocument
        ? [
          {
            kind: [ReflectionKind.TypeAlias],
            isLeaf: true,
            directory: 'types',
            template: 'reflection.member.hbs',
          },
          {
            kind: [ReflectionKind.Variable],
            isLeaf: true,
            directory: 'variables',
            template: 'reflection.member.hbs',
          },
          {
            kind: [ReflectionKind.Function],
            isLeaf: true,
            directory: 'functions',
            template: 'reflection.member.hbs',
          },
        ]
        : []),
    ];
  }
}