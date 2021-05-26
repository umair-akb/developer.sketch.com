"use strict";
const declaration_1 = require("typedoc/dist/lib/utils/options/declaration");
const converter_1 = require("./plugins/converter");
const template_1 = require("./plugins/template");
const group_1 = require("./plugins/group");
module.exports = (PluginHost) => {
    const app = PluginHost.owner;
    app.options.addDeclaration({
        help: '[Markdown Plugin] Do not render page title.',
        name: 'hidePageTitle',
        type: declaration_1.ParameterType.Boolean,
        defaultValue: false,
    });
    app.options.addDeclaration({
        help: '[Markdown Plugin] Do not render breadcrumbs in template.',
        name: 'hideBreadcrumbs',
        type: declaration_1.ParameterType.Boolean,
        defaultValue: false,
    });
    app.options.addDeclaration({
        help: '[Markdown Plugin] Specifies the base path that all links to be served from. If omitted all urls will be relative.',
        name: 'publicPath',
        type: declaration_1.ParameterType.String,
    });
    app.options.addDeclaration({
        help: '[Markdown Plugin] Use HTML named anchors as fragment identifiers for engines that do not automatically assign header ids. Should be set for Bitbucket Server docs.',
        name: 'namedAnchors',
        type: declaration_1.ParameterType.Boolean,
        defaultValue: false,
    });
    app.options.addDeclaration({
        help: '[Markdown Plugin] Output all reflections into seperate output files.',
        name: 'allReflectionsHaveOwnDocument',
        type: declaration_1.ParameterType.Boolean,
        defaultValue: false,
    });
    app.options.addDeclaration({
        help: '[Markdown Plugin] Separator used to format filenames.',
        name: 'filenameSeparator',
        type: declaration_1.ParameterType.String,
        defaultValue: '.',
    });
    app.options.addDeclaration({
        help: '[Markdown Plugin] The file name of the entry document.',
        name: 'entryDocument',
        type: declaration_1.ParameterType.String,
        defaultValue: 'README.md',
    });
    app.options.addDeclaration({
        help: '[Markdown Plugin] Do not render in-page table of contents items.',
        name: 'hideInPageTOC',
        type: declaration_1.ParameterType.Boolean,
        defaultValue: false,
    });
    app.options.addDeclaration({
        help: '[Markdown Plugin] Customise the index page title.',
        name: 'indexTitle',
        type: declaration_1.ParameterType.String,
    });
    if (app.converter.hasComponent('group')) {
        app.converter.removeComponent('group');
        app.converter.addComponent('jekyll-sketch-group', new group_1.GroupPlugin(app.converter));
    }
    app.converter.addComponent('jekyll-sketch-converter', new converter_1.ConverterPlugin(app.converter));
    app.renderer.addComponent('jekyll-sketch-template', new template_1.TemplatePlugin(app.renderer));
};
