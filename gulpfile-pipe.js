/**
 * GFMR builds
 * tasks:
 * 		hl 	: build Highlight.js
 * 		mid	: join & minify Markdown-It and his plugins
 * 		init	: minify base JS
 * 		css	: compile LESS
 * 		
 * 		watch: watch for CSS folders, and rebuild css (`css` task) when needed
 * 		
 * 		default task - `build`
 */

// const chalk  = require('chalk');
const gulp   = require('gulp');
const concat = require('gulp-concat-util');
const csso   = require('gulp-csso');
// const debug  = require('gulp-debug');
const less   = require('gulp-less');
// const rename = require('gulp-rename');
const path   = require('path');
const pump   = require('pump');
const uglify = require('gulp-uglify');
// const gccr   = require('gulp-closure-compiler');
// const watch = require('gulp-watch');


var libPath = {
	styles : './dev/less/gfmr.less',
	hl : {
		dir : './dev/js/hl/build',
		files : [
			'highlight.pack.js',
			'highlightjs-line-numbers.js'
			]
		},
	mdi : {
		dir : './dev/js/mdi',
		files : [
			'markdown-it.js',
			'markdown-it-deflist.js',
			'markdown-it-emoji-light.js'
			]
		},
	init : [
		'init.js'
	]
}

const uglifyOptions = {preserveComments: 'license'};

var destPath = {
	js : path.join( __dirname,'src','js' ),
	css : path.join( __dirname, 'src', 'css' )
}

/*function timeStamp() {
	// return Date().replace(/^.*?(\d+:\d+:\d+).*$/, '$1');
	return chalk.gray((new Date()).toLocaleString().slice(11));
}*/

gulp.task('hl', function (cb) {
	return gulp.src(libPath.hl.files, {cwd: libPath.hl.dir})
		// .pipe(debug({minimal:false}))
		.pipe(concat('hl.js'))
		.pipe(uglify(uglifyOptions))
		.pipe(gulp.dest(destPath.js));
});

gulp.task('mdi', function (cb) {
	return gulp.src(libPath.mdi.files, {cwd: libPath.mdi.dir})
		// .pipe(debug({minimal:false}))
		.pipe(concat('mdi.js'))
		.pipe(uglify(uglifyOptions))
		.pipe(gulp.dest(destPath.js));
});

gulp.task('init', function (cb) {
	return gulp.src( 'init.js', { cwd: './dev/js' })
		// .pipe(debug({minimal: false}))
		// .pipe(uglify(uglifyOptions))
		.pipe(gulp.dest(destPath.js));
});

gulp.task('css', function (cb) {

	var LessAutoprefix = require('less-plugin-autoprefix');
	var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

	var LessCleanCSS = require('less-plugin-clean-css');
	var cleanCss = new LessCleanCSS({advanced: true});

	return gulp.src( libPath.styles )
		// .pipe(debug({minimal:false}))
		.pipe(less({
			plugins: [autoprefix, cleanCss]
		}))
		// .pipe(csso())
		.pipe(gulp.dest(destPath.css));
});

gulp.task('js', ['hl','mdi','init']);
gulp.task('default', ['js','css']);
