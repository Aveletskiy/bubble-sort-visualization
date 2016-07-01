module.exports = function (gulp, plugins, config) {
    var del = require('del');
    gulp.task('clean', function (cb) {
        del([config.source.css+'/**/*','!'+config.source.css+'/~media.css'],cb)
    });
};