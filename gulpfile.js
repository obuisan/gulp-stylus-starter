'use strict';
const fs = require('fs');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');

require('dotenv').load();
const inputPath = process.env.INPUT_PATH || './stylus';
const outputPath = process.env.OUTPUT_PATH || './css';
const fixBrowsers = process.env.AUTOPREFIXER_BROWSERS || '>1%';
const fixGrid = process.env.AUTOPREFIXER_GRID || false;

if (!fs.existsSync(inputPath)) {
  console.error('Error: Input path '+ inputPath +' doesn\'t exist.');
  process.exit(1);
}

gulp.task('default', function () {
  let stylusTask = (minify = false) => {
    gulp.src(inputPath+'/**/!(_*.styl)')
      .pipe(sourcemaps.init())
      .pipe(stylus({
        compress: minify,
        include: ['./', './bower_components/', './node_modules/']
      }))
      .pipe(autoprefixer({
        browsers: fixBrowsers,
        cascade: !minify,
        grid: fixGrid
      }))
      .pipe(gulpif(minify, rename({suffix: '.min'})))
      .pipe(sourcemaps.write('.', {addComment: false}))
      .pipe(gulp.dest(outputPath));
  }
  stylusTask();
  stylusTask(true);
});

gulp.task('watch', function () {
  gulp.watch(inputPath+'/**/*.styl', ['default']);
});
