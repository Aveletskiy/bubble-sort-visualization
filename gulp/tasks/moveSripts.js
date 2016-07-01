module.exports = function (gulp, plugins, config) {
    gulp.task('moveSripts',function(){
        gulp.src(config.source.js+'//*.js',{base: config.destination.js})
            .pipe(plugins.debug(
                {
                    title: 'js moved :'
                }
            ))
            .pipe(gulp.dest(config.destination.js))
    });
};
