(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./plugins/template-plugin"], factory);
    }
})(function (require, exports) {
    "use strict";
    const template_plugin_1 = require("./plugins/template-plugin");
    return (PluginHost) => {
        const app = PluginHost.owner;
        app.renderer.addComponent('jekyll-template-export', new template_plugin_1.TemplatePlugin(app.renderer));
    };
});
