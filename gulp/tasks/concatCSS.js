module.exports = function (gulp, plugins, config) {
    gulp.task('concatCSS', function () {
        gulp.src(config.source.css + '/**/*.css')
            .pipe(plugins.concatCss("style.css"))
            .pipe(gulp.dest(config.destination.css))
    });
};