'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var less = require('gulp-less');

gulp.task('less', function(){
  return gulp.src([
    './assets/bs3/less/dpl.less',
    './assets/bs3/less/bui.less'
    ])
    .pipe(less())
    .pipe(gulp.dest('./assets/bs3/css'));
});

gulp.task('watch', function(){
  gulp.watch('./assets/bs3/less/**/*.less', ['less']);
});

gulp.task('default', function(){
  gulp.start('less');
})
