'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('prepare', function() {
  return gulp.src('./assets/bs3/css', {read: false})
    .pipe(clean());
});

gulp.task('less', function(){
  return gulp.src([
    './assets/bs3/less/dpl.less',
    './assets/bs3/less/bui.less'
    ])
    .pipe(less())
    .pipe(gulp.dest('./assets/bs3/css'));
});

gulp.task('minify-css',['less'], function() {
  return gulp.src('./assets/bs3/css/**.css')
    .pipe(minifyCSS())
    .pipe(rename({suffix: '-min'}))
    .pipe(gulp.dest('./assets/bs3/css'));
});

gulp.task('watch', function(){
  gulp.watch('./assets/bs3/less/**/*.less', ['less']);
});

gulp.task('default',['prepare'], function(){
  gulp.start('less', 'minify-css');
})
