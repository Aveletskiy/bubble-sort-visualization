module.exports = function (gulp, plugins, config) {
    gulp.task('jade', function() {
        gulp.src(config.source.jade+'/index.jade')
            .pipe(plugins.jade({
                pretty: true
            }))
            .pipe(plugins.debug(
                {
                    title: 'jaded :'
                }
            ))
            .pipe(gulp.dest(config.root))
            .pipe(plugins.livereload());
    });
};