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


var paths = {
	styles : './src/css/gfmr.less',
	hl : [
		'hl.js',
		'lang/*.js'
	],
	scripts : [
		'marked.js',
		// 'hl.js',
		'init.js'
	]
}

var out = {
	js : path.join( __dirname,'src','js' ),
	css : path.join( __dirname, 'src', 'css' )
}

function timeStamp() {
	// return Date().replace(/^.*?(\d+:\d+:\d+).*$/, '$1');
	return chalk.gray((new Date()).toLocaleString().slice(11));
}

gulp.task('hl', function () {
	console.log('HL concat');
	return gulp.src(paths.hl, {cwd: './lib/hl-dev/src/'})
		//.pipe(debug({minimal:false}))
		.pipe(concat('hl.js'))
		.pipe(gulp.dest(out.js));
});

gulp.task('js', function () {
	console.log('JS task');
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
	console.log('CSS task');
	return gulp.src( paths.styles )
		.pipe(debug({minimal:false}))
		.pipe(less())
		.pipe(csso())
		.pipe(gulp.dest(out.css));
});

gulp. task('watch', function () {
	return watch('css/*.less', function () {
			gulp.src('css/*.less')
				.pipe(gulp.dest('css'));
		});
});	

gulp.task('default', ['build']);
