'use strict';

module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    files: [
      // libs
      'bower_components/lodash/lodash.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // DIST: test dist to ensure features have been shipped
      //'dist/*.js',
      // SRC: for better error messages if something isn't working
      'src/extension-registry.js',
      'src/constants/extension-registry-utils.js',
      'src/directives/extension-point.js',
      'src/directives/extension-renderer.js',
      'src/services/extension-registry-provider.js',
      'dist/compiled-templates.js',
      // tests
      'test/unit/helpers/*.js',
      'test/unit/spec/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['spec'],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome', 'Firefox', 'IE'],
    browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],
    browserNoActivityTimeout: 5000,
    // toggles continuous integration mode
    // if true, Karma captures browsers, runs the tests, then exits
    singleRun: true,
    // limit how many browsers should be started simultaneous
    concurrency: Infinity
  });
};
