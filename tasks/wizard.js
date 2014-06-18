/*
 * grunt-wizard
 * https://github.com/jantimon/grunt-wizzard
 *
 * Copyright (c) 2014 Jan Nicklas
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('wizard', 'A wizard to select the desired task and options', function () {

    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      choices: null,
      message: 'Choose a task to run:',
      postHandler: function(pickerResult, args){
        console.log('\nYou could have also started this task directly by using\ngrunt ' + args.join(' ').green + '\n\n');
      }
    });

    // Get the cache for the last results
    var cache = require('./../lib/cache')(grunt);
    var cacheName = this.target || 'no-target';
    var lastResult = cache.load(cacheName, function(){
      return {
        task: '',
        parameter: {}
      };
    });

    // Execute the questions if a function was passed
    var choices = typeof options.choices === 'function' ? options.choices(lastResult) : options.choices;

    if(!choices) {
      grunt.log.warn('No choices specified.');
      return done();
    }

    var prompts = require('./../lib/prompts')(grunt);
    prompts(options.message, choices, lastResult)
      .then(function(pickerResult){

        if(!grunt.task.exists(pickerResult.task)) {
          grunt.fatal('The picked task does not exist: "' + pickerResult.task + '"');
        }

        // Store selection
        cache.save(cacheName, pickerResult);

        // Build up arguments
        var args = [pickerResult.task];
        Object.keys(pickerResult.parameter).forEach(function(optionName){
          args.push(optionName + '=' + pickerResult.parameter[optionName]);
        });

        // If the post handler does not cancel launching the tasks
        // Launch the grunt job
        if (options.postHandler(pickerResult, args) !== false) {
          var executeHandler = grunt.util.spawn({
            grunt: true,
            args: args
          }, function(errror, result){
            process.exit(result);
          });

          executeHandler.stdout.pipe(process.stdout);
          executeHandler.stderr.pipe(process.stderr);
        } else {
          done();
        }

      });

  });


  // Prevent grunt from raising an error because it can't find a default task
  if (grunt.cli.tasks.length === 0 && !grunt.task.exists('default')) {
    grunt.registerTask('default', 'wizard');
  }


};
