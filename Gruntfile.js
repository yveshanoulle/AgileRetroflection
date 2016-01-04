/*eslint camelcase: [0] */
'use strict';
module.exports = function (grunt) {

  var filesToJoin = {
    'public/js/global.js': [
      'src/ratchet.js',
      'build/app.js'
    ]
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['coverage'],
    mocha_istanbul: {
      test: {
        src: 'test',
        options: {
          root: '.',
          mask: '**/*.js',
          reporter: 'dot',
          check: {
            lines: 80,
            statements: 80,
            functions: 80
          }
        }
      }
    },
    uglify: {
      development: {
        options: {
          mangle: false,
          beautify: true
        },
        files: filesToJoin
      },
      production: {
        files: filesToJoin
      }
    },
    eslint: {
      target: ['*.js', 'server/*.js', 'src/*.js*', 'test/*.js', '!src/ratchet.js' ]
    },
    browserify: {
      options: {
        banner: 'var retroflectionVersion = \'<%= pkg.version %>\';\n',
//        transform: [require('grunt-react').browserify]
        transform: [[ {presets: ['babel-preset-react']}, require('babelify')]]
      },
      app: {
        src: ['src/main.jsx'],
        dest: 'build/app.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('prepare', ['clean', 'eslint', 'browserify']);

  grunt.registerTask('deployProduction', ['prepare', 'uglify:production']);
  grunt.registerTask('deployDevelopment', ['prepare', 'uglify:development']);

  grunt.registerTask('default', ['deployProduction', 'mocha_istanbul']);
  grunt.registerTask('travis', ['default']);
};
