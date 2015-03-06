'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', ['clean'], function () {
  return gulp.src([
    paths.src + '/{app,components}/**/*.html',
    paths.tmp + '/{app,components}/**/*.html'
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'doIt'
    }))
    .pipe(gulp.dest(paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(paths.tmp + '/partials/templateCacheHtml.js', { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: paths.tmp + '/partials',
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var vendorFilter = $.filter('/serve/app/vendor.css');
  var assets;

  return gulp.src(paths.tmp + '/serve/*.html')
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.replace('../bootstrap-sass-official/vendor/assets/fonts/bootstrap', 'fonts'))

    // .pipe($.uncss({
    //   html: [paths.src + '/app/index.html', paths.src + '/app/history/history.html', paths.src + '/app/lists/lists.html', paths.src + '/app/tasks/tasks.html', paths.src + '/components/footer/footer.html', paths.src + '/components/navbar/navbar.html'],
    //   ignoreSheets: ['/serve/app/index.css'],
    //   ignore: ['.task-list .editable-wrap,.task-list .tasks li.animate-swipe-rt.ng-hide-add,.task-list .tasks li.animate-swipe-rt.ng-hide-remove',
    //     '.task-list .editable-wrap',
    //     '.animate-swipe-lt.ng-hide-add,.animate-swipe-lt.ng-hide-remove',
    //     '.browsehappy',
    //     '.thumbnail',
    //     '.thumbnail img.pull-right',
    //     '.completed',
    //     '.animate-swipe-lt.ng-hide-add,.animate-swipe-lt.ng-hide-remove',
    //     '.animate-swipe-lt.ng-hide-add.ng-hide-add-active',
    //     '.animate-swipe-lt.ng-hide-remove.ng-hide-remove-active',
    //     '.task-list .editable-wrap',
    //     '.task-list .editable-wrap input',
    //     '.task-list .editable-buttons button',
    //     '.task-list .editable-buttons button:hover',
    //     '.task-list .tasks li.animate-swipe-rt.ng-hide-add,.task-list .tasks li.animate-swipe-rt.ng-hide-remove',
    //     '.task-list .tasks li.animate-swipe-rt.ng-hide-add.ng-hide-add-active',
    //     '.task-list .tasks li.animate-swipe-rt.ng-hide-remove.ng-hide-remove-active',
    //     '.delete-link-container',
    //     '.delete-link',
    //     '.delete-link:hover',
    //     '.task-list .editable-wrap',
    //     'i.fa-check-circle-o',
    //     'i.fa-times-circle-o',
    //     '.search-input',
    //     '.search-input::-webkit-input-placeholder',
    //     '.search-input:-moz-placeholder',
    //     '.search-input::-moz-placeholder',
    //     '.search-input:-ms-input-placeholder',
    //     '.search-input::placeholder']
    // }))

    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(paths.dist + '/'))
    .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('images', ['clean'], function () {
  return gulp.src(paths.src + '/assets/images/**/*')
    .pipe(gulp.dest(paths.dist + '/assets/images/'));
});

gulp.task('fonts', ['clean'], function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff, woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('misc', ['clean'], function () {
  return gulp.src(paths.src + '/**/*.ico')
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('build', ['html', 'images', 'fonts', 'misc']);
