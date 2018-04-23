'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const webpack = require('webpack');
const stream = require('webpack-stream');
const istanbul = require('gulp-istanbul');
const isparta = require('isparta');
const mocha = require('gulp-mocha');
const fs = require('fs-sync');

require('babel-register');
require('babel-polyfill');

const config = {
  test: ['test/**/*.spec.js'],
  src: ['src/**/*.js'],
  sass: ['sass/**/*.scss']
};

gulp.doneCallback = err => {
  process.exit(err ? 1 : 0);
};

gulp.task('sass', () => {
  const sassOptions = {outputStyle: 'compressed'};

  return gulp.src('./sass/style.scss')
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('webpack', () => {
  return gulp.src('./src/react/**/*.js')
    .pipe(stream(require('./webpack.config.js')).on('error', console.log))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('nodemon', () => {
  nodemon({
    script: 'src/server/runServer.js',
    ignore: ['src/react/*', 'test/*', 'public/*', 'node_modules/*'],
    ext: 'js'
  });
});

gulp.task('watch', () => {
  gulp.watch(config.sass, ['sass']);
  gulp.watch(config.src, ['webpack']);
});

gulp.task('test:watch', () => {
  gulp.doneCallback = undefined;
  gulp.watch(config.test.concat(config.src), ['test']);
});

gulp.task('remove-coverage', () => {
  fs.remove('coverage');
});

gulp.task('instrument', () => {
  return gulp.src(config.src)
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', () => {
  return gulp.src(config.test)
    .pipe(mocha({
      reporter: 'spec',
      compilers: 'js:babel-core/register',
      require: ['babel-polyfill', 'jsdom-global/register']
    }));
});

gulp.task('test:coverage', ['remove-coverage', 'instrument'], () => {
  return gulp.src(config.test)
    .pipe(mocha({
      reporter: 'dot',
      compilers: 'js:babel-core/register',
      require: ['babel-polyfill','jsdom-global/register']
    }))
    .pipe(istanbul.writeReports({
      dir: 'coverage',
      reporters: ['lcov', 'json', 'text', 'text-summary']
    }));
});

gulp.task('build-bundle', ['webpack', 'sass']);
gulp.task('default', ['nodemon', 'watch', 'build-bundle']);
gulp.task('build', ['build-bundle', 'test']);
