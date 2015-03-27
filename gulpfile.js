var gulp = require('gulp');
var del = require('del');
var es = require('event-stream');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var preprocess = require('gulp-preprocess');
var autoprefixer = require('gulp-autoprefixer');

var production = !!(argv.production);

gulp.task('clean', function (cb) {
  del([
    // delete everything under public directory
    './public/*',
    // except Git files
    '!./public/.git',
    '!./public/.gitignore'
  ], cb);
});

gulp.task('css', ['clean'], function () {
  // keep stream CSS after Sass pre-processing
  var appFile = gulp.src('./app/styles/*.scss')
    .pipe(sass());
  // concat and minify CSS files and stream CSS
  return es.concat(gulp.src('./vendor/styles/*.css'), appFile)
    .pipe(concat('app.css'))
    .pipe(autoprefixer())
    .pipe(gulpif(production,
      [
        minifyCSS(),
        rename('app.min.css')
      ])
    )
    .pipe(gulp.dest('./public/css'));
});

gulp.task('html', ['clean'], function() {
  return gulp.src('./app/assets/*.html')
    .pipe(preprocess({context: {NODE_ENV: production?'production':''}}))
    .pipe(gulpif(production,
      htmlmin({collapseWhitespace: true}))
    )
    .pipe(gulp.dest('./public'));
});

gulp.task('image-min', ['clean'], function () {
  return gulp.src('./app/assets/img/*')
    .pipe(gulpif(production,
      imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('./public/img'));
});

gulp.task('copy-fonts', ['clean'], function() {
  return gulp.src(['./app/assets/css/fonts/**'])
    .pipe(gulp.dest('./public/css/fonts'));
});

gulp.task('copy-extras', function () {
  return gulp.src([
      './app/assets/*.*',
      './app/assets/CNAME',
      '!./app/assets/*.html'], {dot: true})
    .pipe(gulp.dest('./public'));
});

gulp.task('build', ['clean', 'copy-extras', 'copy-fonts', 'css', 'html', 'image-min']);
