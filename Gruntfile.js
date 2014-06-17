/*
 * grunt-wizard
 * https://github.com/jantimon/grunt-wizzard
 *
 * Copyright (c) 2014 Jan Nicklas
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    wizard: {
      default: {
        options: {
          message: 'Choose a task to run',
          choices: {
            'nodeunit': 'Test the plugin',
            'jshint': 'Check for common js errors'
          }
        }
      },
      callbackDemo: {
        options: {
          message: 'Choose a task to run',
          choices: function () {

            // Sub parameter for test
            var optionA = {
              message: 'Choose a task to run',
              name: '--argument-name',
              choices: {
                'test1': {
                  label: 'this is a sub option of test'
                },
                'test2': {
                  label: 'this is another sub option of test'
                }
              }
            };

            // Return the tasks
            return {
              'nodeunit': {
                label: 'Test the plugin',
                parameter: [optionA]
              },
              'jshint': {
                label: 'Check for common js errors'
              }
            };
          }
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

};
