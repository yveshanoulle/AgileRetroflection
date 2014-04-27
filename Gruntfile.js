module.exports = function (grunt) {
  // See http://www.jshint.com/docs/#strict
  "use strict";

  // Project configuration.
  grunt.initConfig({
    // Metadata.

    pkg: grunt.file.readJSON('package.json'),
    mocha_istanbul: {
      test: {
        src: 'test-server', // the folder, not the files,
        options: {
          root: '.',
          mask: '**/*.js',
          reporter: 'dot',
          check: {
            lines: 100,
            statements: 100,
            functions: 100
          }
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
        runnerPort: 6666,
        singleRun: true
      },
      continuous: {
        browsers: ['Chrome'],
        autoWatch: true
      }
    },
    jslint: { // configure the task
      // lint your project's server code
      server: {
        src: [ // some example files
          '*.js'
        ],
        exclude: [
          'server/config.js'
        ],
        directives: { // example directives
          node: true,
          nomen: true,
          vars: true,
          indent: 2,
          unparam: true
        },
        options: {
          edition: 'latest', // specify an edition of jslint or use 'dir/mycustom-jslint.js' for own path
          errorsOnly: true // only display errors
        }
      },
      // lint your project's client code
      client: {
        src: [
          'src/*.js'
        ],
        directives: {
          browser: true,
          indent: 2,
          nomen: true,
          predef: [ 'jQuery', 'angular', '_' ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jslint');

  grunt.registerTask('default', ['concat', 'jslint', 'karma:once', 'mocha_istanbul:test']);
  grunt.registerTask('devmode', ['karma:continuous']);

  // Travis-CI task
  grunt.registerTask('travis', ['default']);
};
