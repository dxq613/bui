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


var desDir = './build';

gulp.task('prepare', function() {
  gulp.src('./build/uploader.js')
    .pipe(clean());
});


//合并js 
gulp.task('uploader.js', function(){
  gulp.src([
      './src/uploader/button/ajbridge.js',
      './src/uploader/button/filter.js',
      './src/uploader/button/base.js',
      './src/uploader/button/htmlButton.js',
      './src/uploader/button/swfButton.js',
      './src/uploader/type/base.js',
      './src/uploader/type/ajax.js',
      './src/uploader/type/flash.js',
      './src/uploader/type/iframe.js',
      './src/uploader/queue.js',
      './src/uploader/theme.js',
      './src/uploader/validator.js',
      './src/uploader/factory.js',
      './src/uploader/uploader.js',
      './src/uploader/base.js'
    ]).pipe(concat('uploader.js'))
    .pipe(gulp.dest(desDir));
});


// 默认任务
gulp.task('default', ['prepare'], function() {
  gulp.start('uploader.js');
});
