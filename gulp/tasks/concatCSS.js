module.exports = function (gulp, plugins, config) {
    gulp.task('concatCSS', function () {
        gulp.src(config.source.css + '/**/*.css')
            .pipe(plugins.concatCss("style.css"))
            .pipe(plugins.debug(
                {
                    title: 'concat css done :'
                }
            ))
            .pipe(gulp.dest(config.destination.css))
            .pipe(plugins.livereload());
    });
};