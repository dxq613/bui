'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('prepare', function() {
  return gulp.src('./css', {read: false})
    .pipe(clean());
});

gulp.task('less', function(){
  return gulp.src([
    './less/dpl.less',
    './less/bui.less'
    ])
    .pipe(less())
    .pipe(gulp.dest('./css'));
});

gulp.task('minify-css',['less'], function() {
  return gulp.src('./css/**.css')
    .pipe(minifyCSS())
    .pipe(rename({suffix: '-min'}))
    .pipe(gulp.dest('./css'));
});

gulp.task('watch', function(){
  gulp.watch('./less/**/*.less', ['less']);
});

gulp.task('default',['prepare'], function(){
  gulp.start('less', 'minify-css');
})
