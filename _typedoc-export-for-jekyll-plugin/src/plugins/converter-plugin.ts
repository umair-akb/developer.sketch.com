import * as fs from 'fs';
import * as path from 'path';

import { BindOption, Renderer } from 'typedoc';
import { Converter } from 'typedoc/dist/lib/converter';
import {
  Component,
  ConverterComponent,
} from 'typedoc/dist/lib/converter/components';


export class ConverterPlugin extends ConverterComponent {
  @BindOption('theme')
  theme!: string;

  initialize() {

    // this.stopListening(this.owner, Converter.EVENT_BEGIN,)
    this.listenTo(this.owner, Converter.EVENT_BEGIN, this.onConverterBegin, 1000);

  }



  /**
   * Overide default assets
   */
  onConverterBegin() {
    Renderer.getDefaultTheme = () => path.join(__dirname, '../theme/resources');
  }
}
