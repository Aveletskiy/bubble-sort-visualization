var gulp    = require('gulp'),
    config  = require('./gulp/config.json'),
    plugins = require('gulp-load-plugins')();

// JADE Compliation
require(config.tasksPath + '/jade')(gulp, plugins, config);

// SASS Compliation
require(config.tasksPath + '/sass')(gulp, plugins, config);

// Concat css
require(config.tasksPath + '/concatCSS')(gulp, plugins, config);

// Minify css
require(config.tasksPath + '/minify-css')(gulp, plugins, config);

// Move js scripts
require(config.tasksPath + '/moveSripts')(gulp, plugins, config);

// Clean css files from src
require(config.tasksPath + '/clean')(gulp, plugins, config);

// Watch Task
require(config.tasksPath + '/watch')(gulp, plugins, config);


// Default Task Triggers Watch
gulp.task('SetDefaultStyleAttributes', function() {
    gulp.start('jade','clean','sass','concatCSS','watch');
});