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
const rename = require('gulp-rename');
const path   = require('path');
const pump   = require('pump');
const uglify = require('gulp-uglify');
// const gccr   = require('gulp-closure-compiler');
// const watch = require('gulp-watch');


var libPath = {
	styles : './dev/less/gfmr.less',
	hl : './dev/js/hl/build/highlight.pack.js',
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
	return gulp.src(libPath.hl)
		// .pipe(debug({minimal:false}))
		.pipe(uglify(uglifyOptions))
		.pipe(rename({basename: 'hl'}))
		.pipe(gulp.dest(destPath.js));
});

gulp.task('mdi', function (cb) {
	return gulp.src(libPath.mdi.files, {cwd: libPath.mdi.dir})
		// .pipe(debug({minimal:false}))
		.pipe(concat.scripts('mdi.js'))
		.pipe(uglify(uglifyOptions))
		.pipe(gulp.dest(destPath.js));
});

gulp.task('init', function (cb) {
	return gulp.src( 'init.js', { cwd: './dev/js' })
		// .pipe(debug({minimal: false}))
		.pipe(uglify(uglifyOptions))
		.pipe(gulp.dest(destPath.js));
});

gulp.task('css', function (cb) {
	return gulp.src( libPath.styles )
		// .pipe(debug({minimal:false}))
		.pipe(less())
		.pipe(csso())
		.pipe(gulp.dest(destPath.css));
});

gulp.task('default', ['hl','mdi','init','css']);
