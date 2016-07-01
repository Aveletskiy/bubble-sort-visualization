var gulp    = require('gulp'),
    config  = require('./gulp/config.json'),
    plugins = require('gulp-load-plugins')();

// SASS Compliation
require(config.tasksPath + '/sass')(gulp, plugins, config);

// Concat css
require(config.tasksPath + '/concatCSS')(gulp, plugins, config);

// Minify css
require(config.tasksPath + '/minify-css')(gulp, plugins, config);

// Move js scripts
require(config.tasksPath + '/moveSripts')(gulp, plugins, config);

// Watch Task
require(config.tasksPath + '/watch')(gulp, plugins, config);



// Default Task Triggers Watch
gulp.task('default', function() {
    gulp.start('watch');
});