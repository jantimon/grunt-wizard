# grunt-wizard

> A wizard to select the desired task and options

![Preview](https://raw.githubusercontent.com/jantimon/grunt-wizzard/master/example.png)

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-wizard --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-wizard');
```

## The "wizard" task

### Overview
In your project's Gruntfile, add a section named `wizard` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  wizard: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.message
Type: `String`
Default value: 'Choose a task to run'

#### options.choices
Type: `Object|Function`

A list of tasks and parameters

### Usage Examples

#### Default Options
In this example, the prompt will ask to choose between nodeunit and jshint:

```js
grunt.initConfig({
  wizard: {
    default: {
      options: {
        message: 'Choose a task to run',
        choices: {
          'nodeunit': 'Test the plugin',
          'jshint': 'Check for common js errors'
        }
      }
    }
  },
})
```

#### Choices function
In this example the result will be the same as in default options however the choices are build up in a function

```js
grunt.initConfig({
  wizard: {
    default: {
      options: {
        message: 'Choose a task to run',
        choices: function(){
          return {
            'nodeunit': 'Test the plugin',
            'jshint': 'Check for common js errors'
          };
      }
    }
  },
})
```

#### Sub parameters
It is also possible to set custom parameter values

```js
grunt.initConfig({
  wizard: {
    default: {
      options: {
        message: 'Choose a task to run',
        choices: function(){
          return {
            'nodeunit': {
              label: 'Test the plugin',
              parameter: {
                  name: '--customParameter',
                  message: 'Choose a value for --customParameter',
                  choices: {
                    'blue': 'Run all tests in blue',
                    'red': 'Run all tests in red'
                  }
                }
              }
            }
            'jshint': 'Check for common js errors'
          };
      }
    }
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Jan Nicklas. Licensed under the MIT license.
