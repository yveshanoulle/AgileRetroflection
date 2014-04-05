module.exports = function (grunt) {
  // See http://www.jshint.com/docs/#strict
  "use strict";

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg         : grunt.file.readJSON('package.json'),
    banner      : '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    jshint      : {
      files  : ['*.js', 'scripts/*', '.jshintrc', '!node_modules/**/*.js*', '!scripts/*.min.js*', '!scripts/swipe*.js*'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    'mocha-hack': {
      options: {
        globals    : ['should'],
        timeout    : 3000,
        ignoreLeaks: false,
        ui         : 'bdd',
        reporter   : 'spec'
      },

      all: { src: 'test/**/*.js' }
    },
    'mocha_phantomjs': {
      all: ['browser-test/**/*.html']
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-hack');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');

  // Default task.
  grunt.registerTask('default', ['jshint', 'mocha-hack',  'mocha_phantomjs']);

  // Travis-CI task
  grunt.registerTask('travis', ['default']);
};
