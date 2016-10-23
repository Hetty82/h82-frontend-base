// Gulp variables
const gulp          = require('gulp');
const sassGlob      = require('gulp-sass-glob');
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
const cssnano       = require('gulp-cssnano');
const uglify        = require('gulp-uglify');
const imagemin      = require('gulp-imagemin');
const cache         = require('gulp-cache');
const del           = require('del');
const runSequence   = require('run-sequence');
const browserSync   = require('browser-sync').create();

// Compilation tasks
gulp.task('styles', function(){
  return gulp.src('src/sass/**/*.+(scss|sass)')
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function(){
  return gulp.src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

gulp.task('images', function(){
  return gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/img'))
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

// Browsersync task
gulp.task('browserSync', function() {
  browserSync.init({
    open: false,
    proxy: "local.h82-frontend-base.dev"
  });
});

// Watch task
gulp.task('watch', function(){
  gulp.watch('src/sass/**/*.+(sass|scss)', ['styles']);
  gulp.watch('src/js/**/*.js', ['scripts', browserSync.reload]);
  gulp.watch('*.html', browserSync.reload);
});

// Clean task
gulp.task('clean', function() {
  return del.sync('dist');
})

// Build task
gulp.task('build', function (callback) {
  runSequence(
    'clean',
    ['styles', 'scripts', 'images', 'fonts'],
    callback
  );
});

//  Default task
gulp.task('default', function (callback) {
  runSequence(['build', 'browserSync', 'watch'],
    callback
  );
})
