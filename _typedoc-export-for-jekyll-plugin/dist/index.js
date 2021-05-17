"use strict";
const converter_plugin_1 = require("./plugins/converter-plugin");
const template_plugin_1 = require("./plugins/template-plugin");
module.exports = (PluginHost) => {
    const app = PluginHost.owner;
    app.converter.addComponent('jekyll-converter-export', new converter_plugin_1.ConverterPlugin(app.converter));
    app.renderer.addComponent('jekyll-template-export', new template_plugin_1.TemplatePlugin(app.renderer));
};
