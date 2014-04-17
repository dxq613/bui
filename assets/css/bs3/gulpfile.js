'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('prepare', function() {
  return gulp.src('./*.css', {read: false})
    .pipe(clean());
});

gulp.task('less', function(){
  return gulp.src([
    './less/dpl.less',
    './less/bui.less'
    ])
    .pipe(less())
    .pipe(gulp.dest('./'));
});

gulp.task('minify-css',['less'], function() {
  return gulp.src('./*.css')
    .pipe(minifyCSS())
    .pipe(rename({suffix: '-min'}))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function(){
  gulp.watch('./**/*.less', ['less']);
});

gulp.task('copy', function(){
  gulp.src('./*.css')
    .pipe(gulp.dest('../../../build/css/bs3/'));
})

gulp.task('default',['prepare'], function(){
  gulp.start('less', 'copy');
})
