import * as path from 'path';

import { BindOption, Renderer } from 'typedoc';
import { Converter } from 'typedoc/dist/lib/converter';
import { Component, ConverterComponent } from 'typedoc/dist/lib/converter/components';
import { Context } from 'typedoc/dist/lib/converter/context';
import {
  DeclarationReflection,
  ProjectReflection,
  ReflectionKind,
  ReferenceReflection
} from 'typedoc/dist/lib/models';

@Component({ name: 'jekyll-sketch-converter' })
export class ConverterPlugin extends ConverterComponent {
  @BindOption('theme')
  theme!: string;

  initialize() {
    // This has to be -1 priority to run first and set the `getDefaultTheme` static function.
    this.listenTo(this.owner, Converter.EVENT_BEGIN, this.onConverterBegin, -1);
    this.listenTo(this.owner, Converter.EVENT_RESOLVE_BEGIN, this.onResolveBegin);

    // This has to be priority -300 to run before the TypeDoc GroupPlugin runs (which has priority -200)
    // so that we can capture children before they're moved into groups.
    this.listenTo(this.owner, Converter.EVENT_RESOLVE_BEGIN, this.mergeChildReferences, -300);
  }

  /**
   * Overide default assets
   */
  onConverterBegin(context) {
    const getDefaultTheme = () => path.join(__dirname, '../theme/resources');

    Renderer.getDefaultTheme = getDefaultTheme;
    this.application.renderer.getDefaultTheme = getDefaultTheme;
  }

  /**
   * Fetches all child reflections and merges them into the project,
   * so that the modular hierarchy based on Module and Namespace reflections
   * is discarded.
   * 
   * Note: this must run before any grouping occurs (TypeDoc / GroupPlugin)
   */
  mergeChildReferences(context) {
    const project = context.project;

    const children = project.children;
    project.children = [];
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      this.importReflections(child, project);
    }

    // At the end of importing all children,
    // Reference reflections have also been imported into the project children.
    // Remove any references that are directly listed as project children,
    // to avoid duplicates.
    this.pruneReferences(project);
  }

  onResolveBegin(context: Context) {
    const themeDir = path.join(__dirname, '../theme');

    // Set the default markdown theme
    this.application.options.setValue('theme', themeDir);
  }

  importReflections(source: DeclarationReflection, target: ProjectReflection) {
    if (source.kindOf(ReflectionKind.SomeModule)) {
      source.traverse((child: DeclarationReflection) => {
        this.importReflections(child, target);
      })
      source.children = [];
    } else {

      this.importReflection(source, target);
    }
  }

  importReflection(source, target: ProjectReflection) {
    source.parent = target;
    target.children?.push(source);
  }

  pruneReferences(project: ProjectReflection) {
    this.application.logger.log(`Pruning ${project.name}`);


    const nonReferenceReflections = project
      .getChildrenByKind(ReflectionKind.All ^ ReflectionKind.Reference);


    project
      .getChildrenByKind(ReflectionKind.Reference)
      .forEach((ref: ReferenceReflection) => {
        if (nonReferenceReflections.find(ref => ref.name == ref.name)) {
          const idx = project.children?.findIndex(child => child.id == ref.id);
          if (idx != undefined && idx >= 0) {
            project.children?.splice(idx, 1);
          }
        }
      })

  }
}
