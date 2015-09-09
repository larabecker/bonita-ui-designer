var jshint = require('gulp-jshint');
var karma = require('karma').server;

module.exports = function(gulp, config) {

  require('./build.js')(gulp, config);
  var paths = config.paths;

  gulp.task('jshint:test', function () {
    return gulp.src(paths.tests)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
  });

  /**
   * unit tests once and exit
   */
  gulp.task('test', ['jshint:test', 'bundle:js', 'bundle:vendors'], function (done) {
    return karma.start({
      configFile: config.paths.karma,
      singleRun: true
    }, done);
  });

  /**
   * unit tests in autowatch mode
   */
  gulp.task('test:watch', ['jshint:test', 'bundle:js', 'bundle:vendors'], function (done) {
    return karma.start({
      configFile: config.paths.karma,
      singleRun: false
    }, done);
  });
};
