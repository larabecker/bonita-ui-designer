module.exports = function(gulp, config) {

  require('./serve.js')(gulp, config);

  var paths = config.paths;

  /**
   * Index file
   */
  gulp.task('index:dev', function () {
    return gulp.src('app/index-dev.html')
      .pipe(gulp.dest(config.paths.dev));
  });

  gulp.task('watch', function() {
    gulp.watch(paths.js, ['bundle:js']);
    gulp.watch([paths.templates], ['bundle:js']);
    gulp.watch(['app/index.html'], ['index:dev']);
    gulp.watch(paths.less, ['bundle:css']);
  });

  gulp.task('dev', ['clean', 'watch'], function() {
    return gulp.start('serve:dev');
  });

};