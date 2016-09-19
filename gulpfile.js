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

'strict mode';


const chalk   = require('chalk');
const del     = require('del');
const path    = require('path');
const pump    = require('pump');
const util    = require('util');

const gulp    = require('gulp');
const concat  = require('gulp-concat-util');
// const csso    = require('gulp-csso');
const debug   = require('gulp-debug');
const gulpif  = require('gulp-if');
const less    = require('gulp-less');
const srcmaps = require('gulp-sourcemaps');
const uglify  = require('gulp-uglify');
// const rename  = require('gulp-rename');
// const gccr         = require('gulp-closure-compiler');
// const stripDebug   = require('gulp-strip-debug');
// const vinylPaths   = require('vinyl-paths');
// const watch        = require('gulp-watch');
// const autoprefixer = require('gulp-autoprefixer');
// const cleancss     = require('gulp-clean-css');

const argv = require('minimist')(process.argv.slice(2));
const devMode = process.env.NODE_ENV === 'development' || argv['dev-mode'] === true;

const srcPath = {
	styles : {
		dir : './dev/less',
		files : [
			'gfmr.less'
			// , 'f12.css'
			// , 'far.css'
			// , 'hl-github.css'
			// , 'hl-night-tropicbird.css'
			// , 'line-numbers.css'
		]
	},
	hl : {
		dir : './dev/js',
		files : [
			'hl/build/highlight.pack.js',
			// 'hl.ln/src/highlightjs-line-numbers.js'
		]
	},
	mdi : {
		dir : './dev/js',
		files : [
			'mdi.core/dist/markdown-it.js',
			'mdi.defl/dist/markdown-it-deflist.js',
			'mdi.emji/dist/markdown-it-emoji-light.js'
		]
	},
	init : [
		'init.js'
	]
};

const uglifyOptions = {preserveComments: 'license'};

var destPath = {
	js : path.join( /*__dirname,*/'src','js' ),
	css : path.join( /*__dirname,*/ 'src', 'css' )
};

function timeStamp() {
	// return Date().replace(/^.*?(\d+:\d+:\d+).*$/, '$1');
	return chalk.gray((new Date()).toLocaleString().slice(11));
}

function showMsg() {
	var s = util.format.apply(util, arguments);
	console.log('[%s] %s', timeStamp(), s);
	return false;
}

function toClean(dir, fileMask) {
	showMsg('%s "%s\\%s"', chalk.yellow.bgRed(' Clean '), chalk.cyan(dir), chalk.yellow(fileMask) );
	return del(path.join(dir, fileMask));
}

/**	
 * Highlight.Js files, concat & uglify
 * Highlight.JS and it's lang packs is already prebuilt
 * and united in one pack. Other filse - are HlJs plugins */
gulp.task('js:hl', function (cb) {
	toClean(destPath.js, 'hl.js*')
		.then(
			pump([
				gulp.src(srcPath.hl.files, {cwd: srcPath.hl.dir})
				//, debug({minimal:false})
				, srcmaps.init()
				// , gulpif(devMode, gulp.dest(destPath.js))
				, gulpif(!devMode, uglify(uglifyOptions))
				, concat('hl.js')
				, srcmaps.write('./')
				, gulp.dest(destPath.js)
			], cb)
		);
});

/**
 * The `Markdown-It`'s files, concat & uglify
 */
gulp.task('js:mdi', function (cb) {
	toClean(destPath.js, 'mdi.js*')
		.then(
			pump([
				gulp.src(srcPath.mdi.files, {cwd: srcPath.mdi.dir})
				//, debug({minimal:false})
				, srcmaps.init()
				// , gulpif(devMode, gulp.dest(destPath.js))
				, gulpif(!devMode, uglify(uglifyOptions))
				, concat('mdi.js')
				, srcmaps.write('./')
				, gulp.dest(destPath.js)
			], cb)
		);
});

/**
 * Extension main logic scipts
 */
gulp.task('js:init', function (cb) {
	toClean(destPath.js, 'init.js*')
		.then(
			pump([
				gulp.src( 'init.js', { cwd: './dev/js' })
				//, debug({minimal: false})
				, gulpif(!devMode, srcmaps.init())
				, gulpif(!devMode, uglify(uglifyOptions))
				, gulpif(!devMode, srcmaps.write('./'))
				, gulp.dest(destPath.js)
			], cb)
		);
});

/**
 * Separate task to clean css folder
 */
gulp.task('css:clean', function(){
	return del(['src/css/**/*']);
});

/** 
 * build CSS, DO NOT use subtask to clean target folder,
 * use special function, that use `del` modul directly
 */
gulp.task('css', /*gulp.series('css:clean'),*/ function (cb) {

	var LessAutoprefix = require('less-plugin-autoprefix');
	var autoprefix = new LessAutoprefix({ browsers: ['chrome > 25', 'opera > 12'] });

	var LessCleanCSS = require('less-plugin-clean-css');
	var cleanCss = new LessCleanCSS({advanced: true});

	/*var LessLesshat = require('less-plugin-lesshat'),
    lesshat = new LessLesshat();*/

	showMsg('%s = "%s"', chalk.yellow('NODE_ENV'), chalk.cyan(process.env.NODE_ENV));
	showMsg('Dev mode = %s', chalk.cyan(devMode));

	toClean(destPath.css, '*')
		.then(			
			// return gulp.src( srcPath.styles )
			pump([ gulp.src( srcPath.styles.files, {cwd : srcPath.styles.dir} )
				// , debug({title: 'Style source files'})
				, srcmaps.init()
				// , gulpif( '*.less' ,less({plugins: [autoprefix, cleanCss]}))
				, less({plugins: [autoprefix, cleanCss]})
				// , debug({title: 'After LESS:'})
				// , less()
				// , autoprefixer()
				// , gulp.dest(destPath.css)
				// , debug({title: 'After dest1:'})
				// , gulpif(!devMode, csso())
				// , debug({title: 'After csso'})
				// , concat('gfmr.css')
				// , debug({title: 'After concat'})
				, srcmaps.write('./')
				// , debug({title: 'After srcMap.write:'})
				, gulp.dest(destPath.css)
				// , debug({title: 'After dest:'})
			], cb)
		);
});

gulp.task('js:all', gulp.parallel('js:hl','js:mdi','js:init'));
gulp.task('build', gulp.parallel('css', 'js:hl', 'js:mdi', 'js:init'));
gulp.task('default', gulp.parallel('css'));
