var gulp = require('gulp')
	, jshint = require('gulp-jshint')
	, less = require('gulp-less')
	, gutil = require('gulp-util')
	, path = require('path')
	, fs = require('fs')
	, uglify = require('gulp-uglify')
	, concat = require('gulp-concat')
	, livereload = require('gulp-livereload')
	, notify = require('gulp-notify')
	, plumber = require('gulp-plumber')
	, sourcemaps = require('gulp-sourcemaps')
	, autoprefixer = require('gulp-autoprefixer')
	, svgSprite = require('gulp-svg-sprite');
	;	


/////////////////////>	Configuration

/**
 *	List of all the css packages with their information
 *	Each entry in the array represent a package.
 *	This represent a standard situation, don't hesitate 
 *	to add or remove a package to reflect the application
 *	
 *	Each group have the following parameters
 *	@param name <String> The name of the group. It will be used to name the generated output
 *	@param output <String> Where to store the result
 *	@param src <String> or <Array> List of the file to include in the package
 *	@param watch <String> or <Array> Files to watch in dev
 **/
var styles = [
	{
		name:		"app",
		output:		"public/statics/styles/",
		src: 		"src/styles/app/app.less",
		watch:	
		[
					"src/styles/app/**/*.less",
					"src/styles/app.less"
		]
	},
	{
		name:		"vendors",
		output:		"public/statics/styles/",
		src:		"src/styles/vendors/vendors.less",
		watch:	
		[
		]
	}
];

/**
 *	List of all the libs packages with their information
 *	Each entry in the array represent a package.
 *	This represent a standard situation, don't hesitate 
 *	to add or remove a package to reflect the application
 *	
 *	Each group have the following parameters:
 *	@param name <String> The name of the group. It will be used to name the generated output
 *	@param output <String> The path where to store the finale compressed output
 *	@param sourceMap <Boolean> Output the sourcemap or not (only in development).
 *	@param lint <Boolean> Lint the library.
 *	@param build <String> How to build the librairies. Available values: uglify, concat
 *	@param watch <String> or <Array> Lint the code.
 *	@param src <String> or <Array> List of all the file to include in the package
 **/
var libs = [
	{
		name:				"vendors",
		output:				"statics/libs/",
		sourceMap:			false,
		lint:				false,
		build:				'concat',
		// watch:				'src/vendors/**/*.js',
		src:				
		[
							,'src/vendors/jquery/dist/jquery.min.js'
							,'src/vendors/bootstrap/dist/js/bootstrap.min.js'
		]
	},

	{
		name:				"app",
		output:				"public/statics/libs/",
		sourceMap:			false,
		lint:				false,
		build:				'concat',
		watch:				'src/libs/**/*.js',
		src:				
		[
							 'src/libs/modernizr.js'
							,'src/libs/class.js'
							,'src/libs/polyfill/*.js'
							,'src/libs/helper.js'
							,'src/libs/events/**/*.js'
							,'src/libs/layout/**/*.js'
							,'src/libs/navigation/**/*.js'
							,'src/libs/pages/AbstractPage.js'
							,'src/libs/pages/**/*.js'
							,'src/libs/sections/**/*.js'
							,'src/libs/controllers/**/*.js'
							// ,'src/libs/components/**/*.js'
		]
	}
]

var svgdefs = [
	{
		name: 				"icons",
		output: 			"public/statics/images",
		src:
		[
							
		]
	}
]


/////////////////////>	Tasks

///////////> Utils

/**
 *	Lint the libraries to detect flaws
 **/
gulp.task('libs.lint', function()
{
	var n = libs.length;
	var lib;
	while(n--)
	{
		lib = libs[n];

		if ( !lib.lint || lib.lint == false )
			continue;

		gulp.src( lib.src )
			.pipe( jshint({strict:true}) )
			.pipe( jshint.reporter('default') )
		;
	}
});

/**
 *	Concatenate the libraries into a file (not compressed)
 **/
gulp.task('libs.concat', function()
{
	var n = libs.length;
	var lib;

	while(n-->0)
	{
		lib = libs[n];

		gulp.src( lib.src )
     	.pipe( concat(lib.name+'.min.js') )
     	.pipe( gulp.dest(lib.output) );
	}
});

gulp.task('svgdefs', function()
{
	var n = svgdefs.length;
	var entry;

	var config = 
	{
	    mode: 
	    {
	        css: 
	        {    
	            render: 
	            {
	                css: true
	            }
	            ,sprite: '../animals.svg'
	        }
	    }
	};
	while( n-- > 0)
	{
		entry = svgdefs[n];

		gulp.src( entry.src )
			.pipe( svgSprite(config) )
			.pipe( gulp.dest(entry.output) );

	}
})

///////////> Dev

/**
 *	Process all the styles groups in the configuration section
 *	- generate the stylesheet (uncompressed)
 *	- generate the source map file
 **/
gulp.task('styles', function () 
{
	var n = styles.length;
	var style;

	while(n-- > 0)
	{
		style = styles[n];

		gulp.src( style.src )
			.pipe( plumber({errorHandler: notify.onError("Error: <%= error.message %>")}) )
			.pipe( sourcemaps.init() )
			.pipe( less({compress: false,}) )
			.pipe( autoprefixer({
	            browsers: ['last 2 versions'],
	            cascade: false
	        }) )
			.pipe( sourcemaps.write( '.' ) )
		  	.pipe( gulp.dest( style.output ) )
		  	.pipe( livereload() )
	}
});

/**
 *	Process the javascript groups in the configuration section
 *	- concat the files
 *	- generate the sourcemap
 **/
gulp.task('libs', ['libs.lint'], function()
{
	var n = libs.length;
	var lib;
	var map;

	while(n-->0)
	{
		lib = libs[n];
		map = lib.sourceMap == undefined ? false : lib.sourceMap;
		filename = lib.name+'.min.js';

		switch ( lib.build )
		{
			case 'uglify':
				gulp.src( lib.src )
		       	.pipe( concat(filename) )
		        .pipe( uglify({ outSourceMap:map }) )
		       	.pipe( gulp.dest(lib.output) )
			  	.pipe( livereload() );
				break;

			case 'concat':
			default:
				gulp.src( lib.src )
		       	.pipe( concat(filename) )
		       	.pipe( gulp.dest(lib.output) )
			  	.pipe( livereload() );
				break;
		}
	}
});

gulp.task('pages', function()
{
	return gulp.src('pages/*.php')
		.pipe(livereload());
});

/**
 *	Developpement mode 
 *
 *	- build the styles (for dev)
 *	- build the scripts (for dev)
 *	- Watch for changed to build the scripts and/or the styles
 **/
gulp.task('live', ['styles', 'libs'], function ()
{
	// auto watch styles file change
	var n = styles.length;
	var style;
	while( n-- )
	{
		style = styles[n];
		if (style.watch)
		{
			gutil.log( '[watch] [styles]' + style.watch );
			gulp.watch(style.watch, ['styles']);			
		}
	}

	// auto watch libs file change
	var n = libs.length;
	var lib;
	while ( n-- )
	{
		lib = libs[n];
		if (lib.watch)
		{
			gutil.log( '[watch] [libs]' + lib.watch );
			gulp.watch(lib.watch, ['libs']);
		}
	}

	// auto reload the application
	// nodemon({ 
	// 	script: './bin/www', 
	// 	ext: 'jade js', 
	// 	ignore: ['node_modules/**', 'src/*', 'public/**'], 
	// 	env: { 'NODE_ENV': 'development' } 
	// })
 //    // .on('change', ['lint'])
 //    .on('restart', function () {
 //      console.log('restarted!')
 //    });
});

///////////> Doc

gulp.task('default', function()
{
	console.log( 'Gulp build script for frontend development' );
	console.log( 'Version: 1.4' );
	console.log( '' );
	console.log( 'Available tasks:' );
	console.log( '' );
	console.log( ' gulp live \t\t This is the task to launch on development, it will build the styles (for dev), build the scripts (for dev), Watch for changed to build the scripts and/or the styles' );
	console.log( ' gulp styles \t Process all the styles groups in the configuration section, generate the stylesheet (uncompressed), generate the source map file' );
	console.log( ' gulp libs \t\t Process the libraries groups in the configuration section, concat the files, uglify the files, generate the sourcemap' );
	console.log( '' );
});
