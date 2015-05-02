module.exports = function (grunt) {
  'use strict';

  var filesToJoin = {
    'public/js/global.js': [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/lodash/lodash.js',
      'bower_components/react/react.js',
      'bower_components/react-router/build/umd/ReactRouter.js',
      'bower_components/ratchet/dist/js/ratchet.js',
      'build/app.js'
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
    jslint: {
      server: {
        src: [
          '*.js'
        ],
        exclude: [
          'server/config.js'
        ],
        directives: {
          node: true,
          nomen: true,
          vars: true,
          indent: 2,
          unparam: true
        },
        options: {
          edition: 'latest',
          errorsOnly: true
        }
      },
      client: {
        src: [
          'build/*.js'
        ],
        directives: {
          browser: true,
          indent: 2,
          nomen: true,
          predef: ['jQuery', 'angular', '_', 'inject']
        }
      }
    },
    'bower-install-simple': {
      default: {
        options: {
          directory: 'bower_components'
        }
      }
    },
    react: {
      single_file_output: {
        files: {
          'build/app.js': 'src/app.jsx'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-install-simple');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-istanbul-coverage');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('prepare', ['bower-install-simple', 'clean', 'copy', 'react']);

  grunt.registerTask('deployProduction', ['prepare', 'uglify:production']);
  grunt.registerTask('deployDevelopment', ['prepare', 'uglify:development']);

  grunt.registerTask('default', ['deployProduction', 'jslint', 'mocha_istanbul:test']); //, 'karma:once', 'coverage']);
  grunt.registerTask('travis', ['default']);
};
