import { Application } from 'typedoc/dist/lib/application';
import { ParameterType } from 'typedoc/dist/lib/utils/options/declaration';

import { TemplatePlugin } from './plugins/template-plugin';

export = (PluginHost: Application) => {
  const app = PluginHost.owner;

  app.renderer.addComponent('jekyll-template-export', new TemplatePlugin(app.renderer));
};