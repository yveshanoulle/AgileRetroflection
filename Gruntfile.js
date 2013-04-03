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
      files  : ['scripts/*', '.jshintrc', '!node_modules/**/*.js*', '!scripts/*.min.js*', '!scripts/swipe*.js*'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    watch       : {
      files: ['<%= jshint.files %>', '**/*.jade'],
      tasks: ['default']
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
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-hack');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');

  // Default task.
  grunt.registerTask('default', ['jshint', 'mocha-hack',  'client-tests']);

  // Browser-Tests
  grunt.registerTask('client-tests', 'Run the client-side Mocha tests through PhantomJS', function () {
    var done = this.async();
    var mocha = grunt.util.spawn({
      cmd : 'node',
      args: [
        'node_modules/mocha-phantomjs/bin/mocha-phantomjs', 'browser-test/tests-without-jquery.html'
      ]
    }, function (error, result, code) {
      done(!code);
    });
    mocha.stdout.pipe(process.stdout);
    mocha.stderr.pipe(process.stderr);
  });

  // Travis-CI task
  grunt.registerTask('travis', ['default']);
};