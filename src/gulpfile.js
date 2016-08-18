var gulp = require('gulp');
var path = require('path');
var concat = require('gulp-concat');
var less = require('gulp-less');
var csso = require('gulp-csso');
var gccr = require('gulp-closure-compiler');
var debug = require('gulp-debug');

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

gulp.task('default', ['css', 'js']);
