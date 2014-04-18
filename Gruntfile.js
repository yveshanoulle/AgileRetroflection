module.exports = function (grunt) {
  // See http://www.jshint.com/docs/#strict
  "use strict";

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    jshint: {
      files: ['*.js', 'scripts/*', '.jshintrc', '!node_modules/**/*.js*', '!scripts/*.min.js*', '!scripts/swipe*.js*'],
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
          reporter: 'spec',
          check: {
            lines: 10,
            statements: 10
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
          "public/js/lodash.min.js",
          "public/js/ratchet.min.js",
          "public/js/angular.min.js",
          "public/js/angular-animate.min.js",
          "public/js/angular-touch.min.js",
          "public/js/angular-ui-router.js",
          "public/js/helpers.js",
          "public/js/questionstore.js",
          "public/js/templates.js",
          "public/js/app.js"
        ],
        dest: "public/js/global.js"
      }
    },
    karma: {
      options : {
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
    }
  });


  grunt.loadNpmTasks('grunt-karma');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat', 'jshint', 'karma:once', 'mocha_istanbul:test']);
  grunt.registerTask('devmode', ['karma:continuous']);

  // Travis-CI task
  grunt.registerTask('travis', ['default']);
};
