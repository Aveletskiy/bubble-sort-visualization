module.exports=function(gulp,plugins,config){
    gulp.task('watch', function () {
        plugins.livereload.listen();

        gulp.watch(config.source.sass+'/**/*.sass', ['sass']);

        gulp.watch(config.source.css+'/**/*.css', ['concatCSS']);

    });
};

