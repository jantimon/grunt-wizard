var Q = require('q');
var inquirer = require('inquirer');

module.exports = function (grunt) {
  'use strict';

  /**
   * Turn a list into a prompt choices array
   *
   * @param choices
   * @returns {Array}
   */
  function alignChoices(choices) {
    var maxLength = 0;
    // Ensure that every choice has a label
    var choiceNames = Object.keys(choices);
    choiceNames.forEach(function (choiceName) {
      choices[choiceName].label = choices[choiceName].label || choiceName;
    });
    // Get the size of the longest choiceName
    choiceNames.forEach(function (choiceName) {
      if (choiceName.length > maxLength) {
        maxLength = choiceName.length;
      }
    });
    // Align the choice
    var choicesArray = [];
    choiceNames.forEach(function (choiceName) {
      choicesArray.push({
        value: choiceName,
        name: choiceName.toString().yellow +
          new Array(maxLength - choiceName.length + 2).join(' ') +
          ' - ' + choices[choiceName].label
      });
    });
    return choicesArray;
  }

  /**
   * Turn all choices in the structure from Array.<string|{label: {string}}> into Array.<{label: {string}}>
   * @param choices {Array.<string|{label: {string}}>}
   * @return {Array.<{label: {string}}>}
   */
  function prepareChoices(choices) {
    var result = {};
    var choiceNames = Object.keys(choices);
    choiceNames.forEach(function (choiceName) {
      result[choiceName] = typeof choices[choiceName] === 'string' ?
        {label : choices[choiceName]} :
        choices[choiceName];
    });
    return result;
  }


  function gruntTaskPicker(message, tasks) {
    var deferred = Q.defer();
    var taskChoices = prepareChoices(tasks);

    // Check if grunt was already launched with a task
    if (grunt.cli.tasks.length) {

      var currentTasks = grunt.cli.tasks.filter(function (taskName) {
        return message[taskName] !== undefined;
      });

      if (currentTasks.length) {
        deferred.resolve(message[currentTasks]);
        return deferred.promise;
      }

      grunt.log.verbose.write('The launched task does not match any wizard choice.');
    }

    // Use inquirer to get the right task
    inquirer.prompt({
      name: 'tasks',
      type: 'list',
      message: message,
      choices: alignChoices(taskChoices)
    }, function (answer) {
      var task = taskChoices[answer.tasks];
      task.name = answer.tasks;
      deferred.resolve(task);
    });

    return deferred.promise;
  }

  function pickTaskParameter(taskParameter, result) {
    var deferred = Q.defer();
    var parameterChoices = prepareChoices(taskParameter.choices);
    var message = taskParameter.message;
    var taskName = taskParameter.name;

    // Use inquirer to get the right parameter
    inquirer.prompt({
      name: 'parameter',
      type: 'list',
      message: message || 'Pick the value for the parameter ' + taskName,
      choices: alignChoices(parameterChoices)
    }, function (answer) {
      result.parameter[taskName] = answer.parameter;
      pickTaskParameters(parameterChoices[answer.parameter], result)
        .then(function () {
          deferred.resolve(result);
        });
    });

    return deferred.promise;
  }

  function pickTaskParameters(task, result) {
    // Get the sub prompts of this task
    var parameterPromptList = task.parameter || [];

    // Helper function to iterate queued over all prompts
    var taskIndex = 0;
    var askForNextTaskParameter = function () {
      var parameterPrompt = parameterPromptList[taskIndex++];
      if (parameterPrompt) {
        return pickTaskParameter(parameterPrompt, result)
          .then(askForNextTaskParameter);
      }
      var deferred = Q.defer();
      deferred.resolve(result);
      return deferred.promise;
    };

    // Iterate over all prompts
    return askForNextTaskParameter();
  }


  // The main wizard function
  return function wizard(message, tasks) {
    return gruntTaskPicker(message, tasks)
      .then(function (task) {
        // Create the result object
        var result = {
          task: task.name,
          parameter: {}
        };
        // Update the result if task parameters are required
        return pickTaskParameters(task, result);
      });
  };

};