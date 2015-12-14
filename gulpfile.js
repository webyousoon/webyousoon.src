// dependances
var gulp = require('gulp');
var del = require('del');
var es = require('event-stream');
var argv = require('yargs').argv;
var pngquant = require('imagemin-pngquant');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var $ = require('gulp-load-plugins')({
  rename: {
    'gulp-minify-css': 'minifycss'
  }
});

// variables
var pjson = require('./package.json');
var production = !!(argv.production);
var basePaths = {
  src: './app/',
  dest: './public/'
};
var paths = {
  html: {
      src: basePaths.src + 'assets/**/*.html',
      dest: basePaths.dest
  },
  images: {
      src: basePaths.src + 'assets/img/*',
      dest: basePaths.dest + 'img/'
  },
  scripts: {
      src: basePaths.src + 'scripts/**/*.js',
      dest: basePaths.dest + 'js/'
  },
  styles: {
      src: basePaths.src + 'styles/**/*.scss',
      dest: basePaths.dest + 'css/'
  }
};

// ******************************************
// DELETE TASKS
// ******************************************

gulp.task('clean', function (cb) {
  del([
    // delete everything under public directory
    './public/*',
    // except Git files
    '!./public/.git',
    '!./public/.gitignore'
  ], cb);
});

// ******************************************
// SRC TASKS
// ******************************************

gulp.task('js', function() {
  gulp.src(paths.scripts.src)
    .pipe($.concat('app.js'))
    // delete console/alert/debug into JS files
    .pipe($.if(production,
      $.stripDebug())
    )
    .pipe($.if(production,
      $.uglify())
    )
    .pipe($.if(production,
      $.rename('app.min.js'))
    )
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(reload({stream: true}));
});

gulp.task('css', function () {

  var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
  };
  var autoprefixerOptions = {
    browsers: ['Android 4']
  };

  return gulp.src(paths.styles.src)
    .pipe($.if(!production, $.sourcemaps.init()))
    .pipe($.sass(sassOptions)).on('error', function logError(error) {
      console.error(error);
    })
    .pipe($.if(!production, $.sourcemaps.write('./stylesheets/maps')))
    .pipe($.if(!production,
      $.rename('app.css'))
    )
    .pipe($.if(production,
      $.rename('app.min.css'))
    )
    // .pipe($.autoprefixer(autoprefixerOptions))
    .pipe($.if(production,
      $.minifycss())
    )
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(reload({stream: true}));
});

gulp.task('html', function() {
  return gulp.src(paths.html.src)
    .pipe($.preprocess({context: {NODE_ENV: production?'production':''}}))
    .pipe($.if(production,
      $.htmlmin({collapseWhitespace: true}))
    )
    .pipe(gulp.dest(paths.html.dest))
    .pipe(reload({stream: true}));
});

gulp.task('image-min', [], function () {
  return gulp.src(paths.images.src)
    .pipe($.if(production,
      $.imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest(paths.images.dest));
});

// ******************************************
// DEST TASKS
// ******************************************

gulp.task('tag', ['html'], function() {
  return gulp.src(paths.html.dest + '*.html')
    .pipe($.replace(/vx.x.x/g, pjson.version))
    .pipe(gulp.dest(paths.html.dest));
});

// ******************************************
// COPY TASKS
// ******************************************

gulp.task('copy-fonts', [], function() {
  return gulp.src(['./app/assets/css/fonts/**'])
    .pipe(gulp.dest('./public/css/fonts'));
});

gulp.task('copy-icons', [], function() {
  return gulp.src(['./app/assets/icons/**'])
    .pipe(gulp.dest(basePaths.dest));
});

gulp.task('copy-extras', function () {
  return gulp.src([
      './app/assets/*.*',
      './app/assets/CNAME',
      '!' + paths.html.src], {dot: true})
    .pipe(gulp.dest(basePaths.dest));
});

// Build the sitemap
gulp.task('sitemap', function () {
  return gulp.src(paths.html.src)
    .pipe($.sitemap({
        siteUrl: 'http://www.webyousoon.com',
        mappings: [{
          pages: ['*.html'],
          changefreq: 'monthly',
          priority: 1,
          lastmod: Date.now()
        }]
    }))
    .pipe(gulp.dest(basePaths.dest));
});

// ******************************************
// DEV TASKS
// ******************************************

// Static server
gulp.task('serve', ['build'], function() {

  var browserSyncOptions = {
    server: {
      baseDir: basePaths.dest
    },
    open: false,
    reloadOnRestart: true
  }

  browserSync(browserSyncOptions);

  gulp.watch(paths.html.src, ['html']);
  gulp.watch(paths.styles.src, ['css']);
  gulp.watch(paths.scripts.src, ['js']);
});

// ******************************************
// MASTER TASKS
// ******************************************

gulp.task('build', ['copy-extras', 'copy-fonts', 'copy-icons', 'js', 'css', 'html', 'image-min', 'tag', 'sitemap']);

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
