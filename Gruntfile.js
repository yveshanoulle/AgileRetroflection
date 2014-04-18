module.exports = function (grunt) {
  // See http://www.jshint.com/docs/#strict
  "use strict";

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['src/*.js', 'test/*.js', 'test-server/*.js', '*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    mocha_istanbul: {
      test: {
        src: 'test-server', // the folder, not the files,
        options: {
          root: '.',
          mask: '**/*.js',
          reporter: 'spec'
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      all: {
        src: [
          "src/3rd-party/lodash.min.js",
          "src/3rd-party/ratchet.min.js",
          "src/3rd-party/angular.min.js",
          "src/3rd-party/angular-animate.min.js",
          "src/3rd-party/angular-touch.min.js",
          "src/3rd-party/angular-ui-router.min.js",
          "src/questionstore.js",
          "src/templates.js",
          "src/app.js"
        ],
        dest: "public/js/global.js"
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      once: {
        browsers: ['PhantomJS'],
        options: {
          files: [
            "public/js/*.js",
            "src/3rd-party/angular-mocks.js",
            "test/**/test-questions.js",
            "test/**/*.js"
          ]
        },
        runnerPort: 6666,
        singleRun: true
      },
      continuous: {
        browsers: ['Chrome'],
        autoWatch: true
      }
    }
  })
  ;

  grunt.loadNpmTasks('grunt-karma');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat', 'jshint', 'karma:once', 'mocha_istanbul:test']);
  grunt.registerTask('devmode', ['karma:continuous']);

  // Travis-CI task
  grunt.registerTask('travis', ['default']);
}
;
