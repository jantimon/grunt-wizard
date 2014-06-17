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
      message: 'Choose a task to run:'
    });

    // Execute the questions if a function was passed
    var choices = typeof options.choices === 'function' ? options.choices() : options.choices;

    if(!choices) {
      grunt.log.warn('No choices specified.');
      return done();
    }

    var prompts = require('./../lib/prompts')(grunt);

    prompts(options.message, choices)
      .then(function(pickerResult){

        if(!grunt.task.exists(pickerResult.task)) {
          grunt.fatal('The picked task does not exist: "' + pickerResult.task + '"');
        }

        // Build up arguments
        var args = [pickerResult.task];
        Object.keys(pickerResult.parameter).forEach(function(optionName){
          args.push(optionName + '=' + pickerResult.parameter[optionName]);
        });
        // Launch grunt
        var executeHandler = grunt.util.spawn({
          grunt: true,
          args: args
        }, function(errror, result){
          process.exit(result);
        });

        executeHandler.stdout.pipe(process.stdout);
        executeHandler.stderr.pipe(process.stderr);
      });

  });


  // Prevent grunt from raising an error because it can't find a default task
  if (grunt.cli.tasks.length === 0 && !grunt.task.exists('default')) {
    grunt.registerTask('default', 'wizard');
  }


};
