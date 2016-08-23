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

const path    = require('path');
const pump    = require('pump');
const del     = require('del');
const gulp    = require('gulp');
const concat  = require('gulp-concat-util');
const less    = require('gulp-less');
const uglify  = require('gulp-uglify');
const debug   = require('gulp-debug');
const srcmaps = require('gulp-sourcemaps');
// const autoprefixer = require('gulp-autoprefixer');
// const csso         = require('gulp-csso');
// const cleancss     = require('gulp-clean-css');
// const chalk        = require('chalk');
// const gccr         = require('gulp-closure-compiler');
// const rename       = require('gulp-rename');
// const stripDebug   = require('gulp-strip-debug');
// const vinylPaths   = require('vinyl-paths');
// const watch        = require('gulp-watch');


const srcPath = {
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

gulp.task('js:hl', function (cb) {
	pump([
		gulp.src(srcPath.hl.files, {cwd: srcPath.hl.dir}),
		// debug({minimal:false}),
		srcmaps.init(),
		uglify(uglifyOptions),
		concat('hl.js'),
		srcmaps.write(),
		gulp.dest(destPath.js)
	], cb);
});

gulp.task('js:mdi', function (cb) {
	pump([
		gulp.src(srcPath.mdi.files, {cwd: srcPath.mdi.dir}),
		// debug({minimal:false}),
		srcmaps.init(),
		uglify(uglifyOptions),
		concat('mdi.js'),
		srcmaps.write(),
		gulp.dest(destPath.js)
	], cb);
});

gulp.task('js:init', function (cb) {
	del.sync([path.join(destPath.js),'init.js*']);
	pump([
		gulp.src( 'init.js', { cwd: './dev/js' }),
		// debug({minimal: false}),
		srcmaps.init(),
		uglify(uglifyOptions),
		srcmaps.write('./'),
		gulp.dest(destPath.js)
	], cb);
});

gulp.task('clean:css', function(cb){
	return del(['src/css/**/*']);
});

gulp.task('css', /*gulp.series('clean:css'),*/ function (cb) {

	var LessAutoprefix = require('less-plugin-autoprefix');
	var autoprefix = new LessAutoprefix({ browsers: ['chrome > 25', 'opera > 12'] });

	var LessCleanCSS = require('less-plugin-clean-css');
	var cleanCss = new LessCleanCSS({advanced: true});

	/*var LessLesshat = require('less-plugin-lesshat'),
    lesshat = new LessLesshat();*/

	// return gulp.src( srcPath.styles )
	pump([ gulp.src( srcPath.styles )
		, debug({title: 'CSS files'})
		, srcmaps.init()
		, less({plugins: [autoprefix, cleanCss]})
		// , less()
		// , autoprefixer()
		// , csso()
		, srcmaps.write('./')
		, gulp.dest(destPath.css)
	], cb);
	;
});

gulp.task('js:all', gulp.parallel('js:hl','js:mdi','js:init'));
gulp.task('default', gulp.parallel('css','js:all'));
