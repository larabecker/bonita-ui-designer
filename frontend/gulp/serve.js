var browserSync = require('browser-sync');
var connect = require('connect');
var serveStatic = require('serve-static');
var http = require('http');

module.exports = function(gulp, config) {

  require('./build.js')(gulp, config);

  var paths = config.paths;

  /**
   * Web Server & livereload
   */
  var proxy = require('http-proxy')
    .createProxyServer({
      target: {
        host: 'localhost',
        port: 8080
      }
    }).on('error', function (e) {
      console.error(e);
    });

  /* proxyMiddleware forwards static file requests to BrowserSync server
   and forwards dynamic requests to our real backend */
  function proxyMiddleware(req, res, next) {

    function matchStaticFile(req) {
      return /\.(html|css|js|png|jpg|jpeg|gif|ico|xml|rss|txt|eot|svg|ttf|woff|map)(\?((r|v|rel|rev)=[\-\.\w]*)?)?$/.test(req.url);
    }

    function matchGenerator(req) {
      return req.url.lastIndexOf('/generator', 0) === 0 || req.url.lastIndexOf('/widgets', 0) === 0;
    }

    if (matchStaticFile(req) && !matchGenerator(req)) {
      next();
    } else {
      proxy.web(req, res);
    }
  }

  function browserSyncInit(baseDir, files, startPath, browser) {
    browser = browser || 'default';

    browserSync.instance = browserSync.init(files, {
      startPath: startPath || '/index.html',
      server: {
        baseDir: baseDir,
        middleware: [
          proxyMiddleware,
          serveStatic(paths.dist)
        ]
      },
      browser: browser
    });
  }

  function serveE2e() {
    var app = connect();
    app.use(serveStatic(paths.test, {
      index: 'index-e2e.html'
    }));

    app.use(serveStatic(paths.dist));

    app.use(function (req, res, next) {
      req.url = '/index-e2e.html';
      next();
    });

    var server = http.createServer(app);
    server.listen(12001);

    console.log('Server started http://localhost:12001');
    return server;
  }


  /**
   * This task is not working with the WebSocket connection, but SockJS falls back on long-polling
   * so the live reload in preview still work
   */
  gulp.task('serve:dev', ['bundle', 'assets', 'index:dev'], function () {
    browserSyncInit(paths.dev, [
      paths.dev + '/**/*.js',
      paths.dev + '/**/*.css'
    ], 'index-dev.html');
  });

  gulp.task('serve:dist', function () {
    browserSyncInit('build/dist', [
      paths.dist + '/**/*.js',
      paths.dist + '/**/*.css'
    ], 'index.html');
  });


  gulp.task('serve:e2e', ['build', 'bundle:e2e', 'index:e2e'], function () {
    return serveE2e(paths);
  });

  return {
    serveE2e: serveE2e,
    browserSyncInit: browserSyncInit
  }
};