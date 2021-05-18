import { Application } from 'typedoc/dist/lib/application';

import { ConverterPlugin } from './plugins/converter-plugin';
import { TemplatePlugin } from './plugins/template-plugin';

export = (PluginHost: Application) => {
  const app = PluginHost.owner;

  app.converter.addComponent('jekyll-sketch-converter', new ConverterPlugin(app.converter));
  app.renderer.addComponent('jekyll-sketch-template', new TemplatePlugin(app.renderer));
};