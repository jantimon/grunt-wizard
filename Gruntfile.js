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

    // Task to be run
    // could also be a custom task
    wizard: {
      default: {
        options: {
          choices: {
            'jshint': 'Check for common js errors',
            'nodeunit': 'Test the plugin',
            'wizard:callbackDemo': 'A more complex wizard example'
          }
        }
      },


      // To try the callbackDemo run the following command: 
      // grunt wizard:callbackDemo
      callbackDemo: {
        options: {
          message: 'Choose a task to run',
          choices: function () {

            // Sub parameter for test
            var optionA = {
              message: 'Chose a color',
              name: '--argument-name',
              choices: ['red', 'blue']
            };
            var optionB = {
              message: 'Choose a language',
              name: '--another-name',
              choices: {
                'en': {
                  label: 'english'
                },
                'de': {
                  label: 'deutsch'
                }
              }
            };

            // Return the tasks
            return {
              'jshint': {
                label: 'Check for common js errors',
                parameter: [optionA, optionB]
              },
              'nodeunit': {
                label: 'Test the plugin',
                parameter: [optionA]
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
