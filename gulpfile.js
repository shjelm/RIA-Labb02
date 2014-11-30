folderToc = require('folder-toc');

var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat');

gulp.task('browserify', function() {
    gulp.src('src/main.js')
      .pipe(browserify({transform:"reactify"}))
      .pipe(concat('main.js'))
      .pipe(gulp.dest('dist'));
});

gulp.task('copyindex', function() {
    gulp.src('src/index.html')
      .pipe(gulp.dest('dist'));
});

gulp.task('copycss', function() {
    gulp.src('src/style/*')
      .pipe(gulp.dest('dist'));
});

gulp.task('copyjson', function() {
    gulp.src('src/components/*.json')
      .pipe(gulp.dest('dist'));
});

gulp.task('docsindex', function(){
  folderToc('docs', {
    name : 'index.html',
    layout: 'classic',
    filter: '*.html',
    title: 'Files'    
  });
});

var docco = require('gulp-docco');
gulp.task('builddocs', function(){
    gulp.src(['src/*/*.js','src/*.js'])
      .pipe(docco())
      .pipe(gulp.dest('./docs'))
});

gulp.task('docs',['builddocs','docsindex']);

// Build gulp
gulp.task('default',['docs', 'browserify', 'copyindex', 'copycss', 'copyjson']);