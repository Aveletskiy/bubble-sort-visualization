module.exports = function (gulp, plugins, config) {
    gulp.task('sass', function () {
        return gulp.src(config.source.sass + '/**/*.sass')
            .pipe(plugins.plumber({
                errorHandler: plugins.notify.onError("ERROR: SASS compilation Failed")
            }))
            .pipe(plugins.sass().on('error', plugins.sass.logError))
            .pipe(plugins.debug(
                {
                    title: 'sass compiled : '+config.source.sass+'->'+config.source.css
                }
            ))
            .pipe(plugins.autoprefixer(config.browserslist))
            .pipe(gulp.dest(config.source.css))
    });
};