import { ConverterComponent } from 'typedoc/dist/lib/converter/components';
export declare class ConverterPlugin extends ConverterComponent {
    theme: string;
    initialize(): void;
    /**
     * Overide default assets
     */
    onConverterBegin(): void;
}
