// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
//var jshint = require('gulp-jshint');
//var sass = require('gulp-sass');
//var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
//var rename = require('gulp-rename');
var gutil = require('gulp-util');
var zip = require('gulp-zip');

var manifest = require('./package.json');

// note: use ! to exclude
var paths = {
  src: ['./public/**/*.*', './manifest.webapp']  
};

// Tasks

// update libs with npm and bower

// build to zipfile (still needs manual deployment to gh-pages)
gulp.task('zip', [], function() {
    // Gets the current version from the manifest file
    var version = manifest.version;

    // Logs a colored message on the console
    gutil.log(gutil.colors.yellow('===== PACKAGING v' + version + ' ZIP ======'));

    return gulp
       .src(paths.src)
       .pipe(zip('trainingplanner.zip'))
       .pipe(gulp.dest('./target'));
});

// test

gulp.task('default', ['zip']);