/**
 * GFMR builds
 * tasks:
 * 		hl 	: build Highlight.js
 * 		js	: minify JS files with Google closure compiler
 * 		css	: compile LESS
 * 		build: js+css
 * 		watch: watch for CSS folders, and rebuild css (`css` task) when needed
 * 		
 * 		default task - `build`
 */

const gulp = require('gulp');
const path = require('path');
const concat = require('gulp-concat');
const less = require('gulp-less');
const csso = require('gulp-csso');
const gccr = require('gulp-closure-compiler');
const debug = require('gulp-debug');
const watch = require('gulp-watch');
const chalk = require('chalk');


var libPath = {
	styles : './less/gfmr.less',
	hl : [
		'highlight.js',
		'highlightjs-line-numbers.js',
		'lang/*.js'
	],
	mdi : [
		'markdown-it.js',
		'markdown-it-deflist.js',
		'markdown-it-emoji-light.js'
	],
	scripts : [
		'init.js'
	]
}

var destPath = {
	js : path.join( __dirname,'src','js' ),
	css : path.join( __dirname, 'src', 'css' )
}

function timeStamp() {
	// return Date().replace(/^.*?(\d+:\d+:\d+).*$/, '$1');
	return chalk.gray((new Date()).toLocaleString().slice(11));
}

function doLog(text) {
	console.log('[%s] %s', timeStamp(), text);
}

gulp.task('hl', function () {
	doLog('HL concat');
	return gulp.src(libPath.hl, {cwd: './lib/hl-dev/'})
		.pipe(debug({minimal:false}))
		.pipe(concat('hl.js'))
		.pipe(
			gccr ({
				compilerPath: 'd:\\TLS\\gccr\\gccr.jar',
				fileName: 'hl.min.js'
			})
		)
		.pipe(gulp.dest(destPath.js));
});

gulp.task('mdi', function () {
	doLog('MDI concat');
	return gulp.src(libPath.hl, {cwd: './lib/mdi-dev/'})
		.pipe(concat('mdi.js'))
		//.pipe(debug({minimal:false}))
		.pipe(
			gccr ({
				compilerPath: 'd:\\TLS\\gccr\\gccr.jar',
				fileName: 'mdi.min.js'
			})
		)
		.pipe(gulp.dest(destPath.js));
});

gulp.task('js', function () {
	doLog('compact init');
	return gulp.src( 'init.js', { cwd: './src/js' })
		.pipe(debug({minimal: false}))
		.pipe(
			gccr ({
				compilerPath: 'd:\\TLS\\gccr\\gccr.jar',
				fileName: 'init.min.js'
			})
		)
		//.pipe(debug({minimal:false}))
		.pipe(gulp.dest('./'));
});

gulp.task('css', function () {
	doLog('CSS task');
	return gulp.src( libPath.styles )
		.pipe(debug({minimal:false}))
		.pipe(less())
		.pipe(csso())
		.pipe(gulp.dest(destPath.css));
});

gulp.task('default', ['hl','mdi','js','css']);
