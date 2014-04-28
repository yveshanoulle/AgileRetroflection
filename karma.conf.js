module.exports = function (config) {
  "use strict";
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      "src/3rd-party/lodash.min.js",
      "src/3rd-party/ratchet.min.js",
      "src/3rd-party/angular.min.js",
      "src/3rd-party/angular-animate.min.js",
      "src/3rd-party/angular-touch.min.js",
      "src/3rd-party/angular-ui-router.min.js",
      "src/3rd-party/angular-mocks.js",
      "src/questionstore.js",
      "src/templates.js",
      "src/app.js",
      "test/**/test-questions.js",
      "test/**/*.js"
    ],

    // list of files to exclude
    exclude: [
    ],

    // possible values: 'dots', 'progress'
    reporters: ['dots', 'coverage'],

    // web server port
    // CLI --port 9876
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    // CLI --colors --no-colors
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // CLI --log-level debug
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    // CLI --auto-watch --no-auto-watch
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // CLI --browsers Chrome,Firefox,Safari
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    // CLI --capture-timeout 5000
    captureTimeout: 20000,

    // Auto run tests on start (when browsers are captured) and exit
    // CLI --single-run --no-single-run
    singleRun: false,

    // report which specs are slower than 500ms
    // CLI --report-slower-than 500
    reportSlowerThan: 500,

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'src/*.js': ['coverage']
    },

    coverageReporter: {
      reporters: [
        {type: 'html', dir: 'coverage-karma/'},
        {type: 'json', dir: 'coverage-karma/'}
      ]
    },

    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-coverage'
    ]
  });
};