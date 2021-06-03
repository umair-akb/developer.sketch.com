import { ConverterComponent } from 'typedoc/dist/lib/converter/components';
import { Context } from 'typedoc/dist/lib/converter/context';
export declare class ConverterPlugin extends ConverterComponent {
    theme: string;
    initialize(): void;
    /**
     * Overide default assets
     */
    onConverterBegin(context: Context): void;
    onResolveBegin(context: Context): void;
}
