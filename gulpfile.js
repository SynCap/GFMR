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

const chalk  = require('chalk');
const gulp   = require('gulp');
const concat = require('gulp-concat-util');
const csso   = require('gulp-csso');
const debug  = require('gulp-debug');
const less   = require('gulp-less');
const path   = require('path');
const pump   = require('pump');
const uglify = require('gulp-uglify');
const gccr   = require('gulp-closure-compiler');
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
	scripts : [
		'init.js'
	]
}

const uglifyOptions = {preserveComments: 'license', output: {ie_proof: false}};

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
	pump([
		gulp.src(libPath.hl),
		debug({minimal:false}),
		uglify(uglifyOptions),
		/*gccr ({
			compilerPath: 'd:/TLS/GCCR/gccr.jar',
			fileName: 'hl.min.js'
		}),*/		
		gulp.dest(destPath.js)
	], cb);
});

gulp.task('mdi', function (cb) {
	doLog('MDI concat');
	pump([ 
		gulp.src(libPath.mdi.files, {cwd: libPath.mdi.dir}),
		concat.scripts('mdi.min.js'),
		// debug({minimal:false}),
		uglify(uglifyOptions),
		gulp.dest(destPath.js)
	], cb);
});

gulp.task('js', function (cb) {
	doLog('compact init');
	pump([
		gulp.src( 'init.js', { cwd: './src/js' }),
		debug({minimal: false}),
		uglify(uglifyOptions),
			/*gccr ({
				compilerPath: 'd:\\TLS\\gccr\\gccr.jar',
				fileName: 'init.min.js'
			}),*/
		//debug({minimal:false}),
		gulp.dest(destPath.js)
	],cb);
});

gulp.task('css', function (cb) {
	doLog('CSS task');
	pump([
		gulp.src( libPath.styles ),
		debug({minimal:false}),
		less(),
		csso(),
		gulp.dest(destPath.css)
	], cb);
});

gulp.task('default', ['hl','mdi','js','css']);
