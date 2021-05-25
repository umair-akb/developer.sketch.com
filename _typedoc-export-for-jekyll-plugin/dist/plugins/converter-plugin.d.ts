import { ConverterComponent } from 'typedoc/dist/lib/converter/components';
import { Context } from 'typedoc/dist/lib/converter/context';
import { DeclarationReflection, ProjectReflection } from 'typedoc/dist/lib/models';
export declare class ConverterPlugin extends ConverterComponent {
    theme: string;
    initialize(): void;
    /**
     * Overide default assets
     */
    onConverterBegin(context: any): void;
    /**
     * Fetches all child reflections and merges them into the project,
     * so that the modular hierarchy based on Module and Namespace reflections
     * is discarded.
     *
     * Note: this must run before any grouping occurs (TypeDoc / GroupPlugin)
     */
    mergeChildReferences(context: any): void;
    onResolveBegin(context: Context): void;
    importReflections(source: DeclarationReflection, target: ProjectReflection): void;
    importReflection(source: any, target: ProjectReflection): void;
    pruneReferences(project: ProjectReflection): void;
}
