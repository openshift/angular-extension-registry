'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    filesize = require('gulp-filesize'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    //rimraf = require('gulp-rimraf'),
    del = require('del'),
    diff = require('gulp-diff'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    templateCache = require('gulp-angular-templatecache');


var src = './src/',
    dist = './dist/',
    demos = './demo/';

var srcAll = src + '**/*',
    distAll = dist +'**/*',
    demoAll = demos + '**.*';

var srcJS = src + '/**/*.js',
    srcView = src + '/views/**/*.html';

var outputJS = 'angular-extension-registry.js',
    outputTpl = 'compiled-templates.js';

var buildSource = [
    src + 'extension-registry.js',
    src + 'constants/extension-registry-utils.js',
    src + 'services/extension-registry-provider.js',
    src + 'directives/extension-point.js',
    src + 'directives/extension-renderer.js'
  ];

gulp.task('clean', function() {
  return del([dist + '**.*.js'], function(err, paths) {
    gutil.log('cleaned files/folders:\n', paths.join('\n'), gutil.colors.green());
  });
});

gulp.task('jshint', function() {
  return gulp
          .src(srcJS)
          .pipe(jshint())
          .pipe(jshint.reporter(stylish));
});

gulp.task('templates', function () {
  return gulp
          .src(srcView)
          .pipe(templateCache({
            module: 'extension-registry'
          }))
          .pipe(rename(outputTpl))
          .pipe(filesize())
          .pipe(gulp.dest(dist));
});

gulp.task('build', ['clean','templates', 'jshint'], function () {
  return gulp
          .src(buildSource)
          .pipe(concat(outputJS))
          .pipe(filesize())
          .pipe(gulp.dest(dist));
});

gulp.task('min', ['build', 'templates'], function() {
    return gulp
            .src(dist + outputJS)
            .pipe(uglify().on('error', gutil.log))
            .pipe(rename({ extname: '.min.js' }))
            .pipe(filesize())
            .pipe(gulp.dest(dist));
});

gulp.task('serve', function() {
  browserSync({
     server: {
       baseDir: './'
     }
   });

   // TODO: live-reloading for demo not working yet.
   gulp.watch([srcAll, distAll, demoAll], reload);
});


// initial stub in of a gulp task to check diff
gulp.task('verify', function() {
  // TODO: will have to go all the way to src, not the semi-built,
  // to be confident that there is no diff.  How to do via gulp
  // w/o having a task that is just a repeat of all other tasks?
  // return gulp
  //         .src(dist + outputJS)
  //         .pipe(uglify())
  //         .pipe(diff(dist + 'angular-extension-registry.js'))
  //         .pipe(diff.reporter({fail: true}));
});

gulp.task('default', ['min', 'serve']);
