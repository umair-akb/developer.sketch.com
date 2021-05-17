import { Application } from 'typedoc/dist/lib/application';
import { ParameterType } from 'typedoc/dist/lib/utils/options/declaration';

import { ConverterPlugin } from './plugins/converter-plugin';
import { TemplatePlugin } from './plugins/template-plugin';

export = (PluginHost: Application) => {
  const app = PluginHost.owner;

  app.converter.addComponent('jekyll-converter-export', new ConverterPlugin(app.converter));
  app.renderer.addComponent('jekyll-template-export', new TemplatePlugin(app.renderer));
};