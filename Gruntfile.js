'use strict';
module.exports = function (grunt) {
  /*eslint camelcase: 0*/

  var filesToJoin = {
    'public/js/global.js': [
      'node_modules/lodash/index.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-touch/angular-touch.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'src/questionstore.js',
      'src/templates.js',
      'src/app.js'
    ]
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['coverage', 'coverage-karma'],
    copy: {
      css: {
        expand: true,
        src: 'bower_components/ratchet/dist/css/*.min.css',
        dest: 'public/css',
        flatten: true
      },
      fonts: {
        expand: true,
        src: 'bower_components/ratchet/dist/fonts/*',
        dest: 'public/fonts',
        flatten: true
      }
    },
    mocha_istanbul: {
      test: {
        src: 'test-server',
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
    uglify: {
      development: {
        options: {
          mangle: false,
          beautify: true,
          banner: 'retroflection_version = \'<%= pkg.version %>\';\n'
        },
        files: filesToJoin
      },
      production: {
        options: {
          banner: 'retroflection_version = \'<%= pkg.version %>\';\n'
        },
        files: filesToJoin
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
      }
    },
    coverage: {
      options: {
        thresholds: {
          'statements': 90,
          'branches': 50,
          'lines': 90,
          'functions': 79
        },
        dir: 'coverage-karma'
      }
    },
    eslint: {
      options: {quiet: true},
      target: ['src/**/*.js', 'server/**/*.js', 'test/**/*.js', 'test-server/**/*.js', '*.js']
    },
    'bower-install-simple': {
      default: {
        options: {
          directory: 'bower_components'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-install-simple');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-istanbul-coverage');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('prepare', ['bower-install-simple', 'clean', 'copy']);

  grunt.registerTask('deployProduction', ['prepare', 'uglify:production']);
  grunt.registerTask('deployDevelopment', ['prepare', 'uglify:development']);

  grunt.registerTask('default', ['deployProduction', 'eslint', 'mocha_istanbul:test', 'karma:once', 'coverage']);
  grunt.registerTask('travis', ['default']);
};
