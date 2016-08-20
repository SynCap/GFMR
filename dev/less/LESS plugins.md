LESS plugins
============

## install

	npm i -g 
		less-group-css-media-queries
		less-plugin-advanced-color-functions
		less-plugin-autoprefix
		less-plugin-clean-css
		less-plugin-csscomb
		less-plugin-inline-urls
		less-plugin-lesshat
		less-plugin-lists
		less-plugin-npm-import
		less-plugin-pleeease

		less-plugin-bootstrap
		less-plugin-flexboxgrid
		less-plugin-flexiblegs
		less-plugin-ionic
		less-plugin-skeleton

## programmatic use

	var LessAutoprefix = require('less-plugin-autoprefix');
	var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

	var LessPluginCleanCSS = require('less-plugin-clean-css');
	var cleanCSSPlugin = new LessPluginCleanCSS({advanced: true});

	var LessPluginCSScomb = require('less-plugin-csscomb'),
	csscombPlugin = new LessPluginCSScomb("zen");

	var LessPluginGroupMediaQueries = require('less-plugin-group-css-media-queries'),
	lessGroupPlugin = new LessPluginGroupMediaQueries();

	var LessPluginAdvancedColorFunctions = require('less-plugin-advanced-color-functions'),
	AdvancedColorFunctions = new LessPluginAdvancedColorFunctions();

	var Skeleton = require('less-plugin-skeleton'),
	SkeletonPlugin = new Skeleton();

	var LessPluginLesshat = require('less-plugin-less'),
	LesshatPlugin = new LessPluginLesshat();

	var LessPluginFlexiblegs = require('less-plugin-flexiblegs'),
	FlexiblegsPlugin = new LessPluginFlexiblegs();

	var LessPluginFlexboxgrid = require('less-plugin-flexboxgrid'),
	FlexboxgridPlugin = new LessPluginFlexboxgrid();

	var LessPluginBootstrap = require('less-plugin-bootstrap'),
	bootstrapPlugin = new LessPluginBootstrap();

	var LessPluginpleeease = require('less-plugin-pleeease'),
	pleeeasePlugin = new LessPluginpleeease({browsers: ["IE 9"]});

	var NpmImportPlugin = require("less-plugin-npm-import"),
	options = { plugins: [new NpmImportPlugin({prefix: '~'})] };

	var inline-urls-plugin = require('less-plugin-inline-urls');







