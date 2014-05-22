'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var n2a = require('gulp-native2ascii');
var chug = require( 'gulp-chug' );

// gulp.task('prepare', function() {
//   gulp.src('./build/uploader.js')
//     .pipe(clean());
// });


//合并js 
gulp.task('uploader.js', function(){
  gulp.src([
      './button/ajbridge.js',
      './button/filter.js',
      './button/base.js',
      './button/htmlButton.js',
      './button/swfButton.js',
      './type/base.js',
      './type/ajax.js',
      './type/flash.js',
      './type/iframe.js',
      './queue.js',
      './theme.js',
      './validator.js',
      './factory.js',
      './uploader.js',
      './base.js'
    ]).pipe(concat('uploader.js'))
    .pipe(gulp.dest('../../build'));
});


// 默认任务
gulp.task('default', function() {
  gulp.start('uploader.js');
});
