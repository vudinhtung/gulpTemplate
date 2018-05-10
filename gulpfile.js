'use strict'

// template

var gulp = require('gulp')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var plumber = require('gulp-plumber')
var notify = require('gulp-notify')
var autoprefixer = require('gulp-autoprefixer')
var imagemin = require('gulp-imagemin')
var runSequence = require('run-sequence')
var del = require('del')
var browserSync = require('browser-sync').create()
var cleanCSS = require('gulp-clean-css')
var rename = require('gulp-rename')

var config = {
  styles: {
    src: 'src/scss/**/*.+(sass|scss|css)',
    dest: 'public/css'
  },

  scripts: {
    src: 'src/scripts/**/*',
    dest: 'public/scripts'
  },

  fonts: {
    src: 'src/fonts/**/*',
    dest: 'public/fonts'
  },

  images: {
    src: 'src/images/**/*',
    dest: 'public/images'
  },

  htmls: {
    src: 'src/*.html',
    dest: 'public/'
  },

  dist: {
    root: 'public'
  }
}

// Notify error
var onError = function(err) {
  notify.onError({
    title: 'Error!',
    subtitle: 'Failure!',
    message: 'Error: <%= error.message %>',
    sound: 'none'
  })(err) // Show error notification
  this.emit('end') // Prevent terminal quitting!
}

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: config.dist.root
    }
  })
})

gulp.task('styles', function() {
  return gulp
    .src(config.styles.src) // Gets all files ending with .scss in app/scss
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true,
        sourceMap: 'scss'
      }).on('error', onError)
    )
    .pipe(
      autoprefixer({
        browsers: ['last 30 versions'],
        cascade: false
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.styles.dest))
    .pipe(cleanCSS())
    .pipe(
      rename({
        extname: '.min.css'
      })
    )
    .pipe(gulp.dest(config.styles.dest))
    .pipe(
      browserSync.reload({
        stream: true
      })
    )
})

gulp.task('htmls', function() {
  return gulp
    .src(config.htmls.src)
    .pipe(gulp.dest(config.htmls.dest))
    .pipe(
      browserSync.reload({
        stream: true
      })
    )
})

gulp.task('images', function() {
  return gulp
    .src(config.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(config.images.dest))
    .pipe(
      browserSync.reload({
        stream: true
      })
    )
})

gulp.task('fonts', function() {
  return gulp.src(config.fonts.src).pipe(gulp.dest(config.fonts.dest))
})

gulp.task('scripts', function() {
  return gulp
    .src(config.scripts.src)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.scripts.dest))
    .pipe(
      browserSync.reload({
        stream: true
      })
    )
})

gulp.task('watch', ['browserSync'], function() {
  gulp.watch(config.fonts.src, ['fonts'])
  gulp.watch(config.styles.src, ['styles'])
  gulp.watch(config.scripts.src, ['scripts'])
  gulp.watch(config.images.src, ['images'])
  gulp.watch(config.htmls.src, ['htmls'])

  // Other watchers
})

gulp.task('clean', function() {
  return del.sync('public')
})

gulp.task('dev', function(callback) {
  callback = callback || function() {}
  runSequence(
    ['styles', 'htmls', 'fonts', 'images', 'scripts', 'copysrc'],
    'watch',
    callback
  )
})

gulp.task('build', function(callback) {
  callback = callback || function() {}
  runSequence(['styles', 'htmls', 'fonts', 'images', 'scripts'], callback)
})
