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
  return es.concat(gulp.src('./app/assets/css/*.css'), appFile)
    .pipe(concat('app.css'))
    .pipe(minifyCSS())
    //.pipe(rename('app.min.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('html-min', ['clean'], function() {
  return gulp.src('./app/assets/*.html')
    //.pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./public'));
});

gulp.task('image-min', ['clean'], function () {
  return gulp.src('./app/assets/img/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('./public/img'));
});

gulp.task('copy-fonts', ['clean'], function() {
  return gulp.src(['./app/assets/css/fonts/**'])
    .pipe(gulp.dest('./public/css/fonts'));
});

gulp.task('build', ['clean', 'copy-fonts', 'css', 'html-min', 'image-min']);
