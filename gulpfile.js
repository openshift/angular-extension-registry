var gulp = require('gulp'),
  gutil = require('gulp-util'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  //rimraf = require('gulp-rimraf'),
  del = require('del'),
  templateCache = require('gulp-angular-templatecache');

gulp.task('clean', function() {
  return del(['./dist/**.*.js'], function(err, paths) {
    console.log('cleaned files/folders:\n', paths.join('\n'));
  })
});

gulp.task('jshint', function() {
  gulp.src('./src/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
});

gulp.task('templates', function () {
  return gulp.src('./src/views/**/*.html')
    .pipe(templateCache({
      module: 'extension-registry'
    }))
    .pipe(rename('compiled-templates.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['clean','templates', 'jshint'], function () {
  return gulp.src([
      './src/extension-registry.js',
      './src/constants/extension-registry-utils.js',
      './src/services/extension-input-provider.js',
      './src/directives/extension-output.js',
      './src/directives/extension-renderer.js'
    ])
    .pipe(concat('angular-extension-registry.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('min', ['build', 'templates'], function() {
    return gulp.src('./dist/angular-extension-registry.js')
            .pipe(rename('angular-extension-registry.min.js'))
            .pipe(uglify().on('error', gutil.log))
            .pipe(gulp.dest('dist'));
})

gulp.task('default', ['min']);
