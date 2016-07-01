module.exports = function (gulp, plugins, config) {
    gulp.task('minify-css', function() {
        gulp.src(config.destination.css+'/*.css')
            .pipe(plugins.cleanCSS({compatibility: 'ie8'}))
            .pipe(plugins.cleanCSS({debug:true},function(details){
                    plugins.debug({
                        title: details.name+': '+details.stats.originalSize,
                        title: details.name+': '+details.stats.minifiedSize
                    })
                }
            ))
            .pipe(gulp.dest(paths.destination.css));
    });
};
