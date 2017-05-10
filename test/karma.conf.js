'use strict';

module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    files: [
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
    browsers: ['Firefox'],
    browserNoActivityTimeout: 5000,
    // toggles continuous integration mode
    // if true, Karma captures browsers, runs the tests, then exits
    singleRun: true,
    // limit how many browsers should be started simultaneous
    concurrency: Infinity
  });
};
