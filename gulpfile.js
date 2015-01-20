var gulp = require('gulp');
var config = require('./config.json');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cached');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var rsync = require('gulp-rsync');

// https://www.npmjs.com/package/favicons/

// TODO: cb function syntax?? what is cb??
gulp.task('clean', function(cb) {
  del([config.js.dest, config.css.dest], cb);
});

gulp.task('rm-dist', function(cb) {
  del([config.dest], cb);
});

var cmq = require('gulp-combine-media-queries');
gulp.task('cmq', function () {
  gulp.src(config.css.src)
    .pipe(cmq({
      log: true
    }))
    .pipe(gulp.dest(config.css.dest));
});

gulp.task('js', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor js)
  // with sourcemaps all the way down
  return gulp.src(config.js.src)
    .pipe(sourcemaps.init())
      // .pipe(coffee())
      .pipe(jshint())
      .pipe(uglify())
      .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.js.dest));
});

// // Lint Task
// gulp.task('js', ['lint'], function() {
//     return gulp.src(config.js.src)
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

// Compile Sass
gulp.task('sass', ['compile'], function() {
    return gulp.src(config.sass.src)
        .pipe(sass())
        .pipe(gulp.dest(config.sass.dest));
});

// TODO: add function to resize images ala gulp-image-resize
// Copy all static img
gulp.task('img', function() {
  return gulp.src(config.img.src)
  .pipe(imagemin({ 
        optimizationLevel: 7, 
        progressive: true, 
        // interlaced: true,
        // use: [jpegtran()]
      }))
    .pipe(gulp.dest(config.img.dest));
});

// // Reload Browser On File Change
// gulp.task('sync', function() {
//     browserSync.init( [destDir + '**/*'], {
//         proxy: {
//             host: "localhost",
//             port: 8888
//         }
//     });
// });

function copy (param) {
    gulp.src(param.src)
    .pipe(gulp.dest(param.dest));
}

gulp.task('cphtml', function() {
  copy(config.html);
});

gulp.task('cpjs', function() {
  copy(config.js);
});

gulp.task('cpcss', function() {
  copy(config.css);
});

gulp.task('cpprof', function() {
  copy(config.profile);
});

gulp.task('cpimg', function() {
  copy(config.img);
});

gulp.task('cpfonts', function() {
  copy(config.fonts);
});

gulp.task('cpall', function() {
  copy(config.html);
  copy(config.js);
  copy(config.css);
  copy(config.profile);
  copy(config.img);
  copy(config.fonts);
});

// TODO: use gulp-shell instead...
gulp.task('deploy', function() { 
  return gulp.src(config.dest)
    .pipe(rsync({
      root: config.dest,
      port: 22,
      username: config.rsync.username,
      hostname: config.rsync.hostname,
      destination: config.rsync.dest,
      exclude: [config.rsync.exclude],
      // username: 'wmyers7',
      // hostname: 'schizo.cs.byu.edu',
      // destination: '~/public_html',
      // exclude: ['node_modules'],
      recursive: true,
      update: true,
      times: true,
      clean: true, // delete all files and directories not in source paths 
      args: ['--verbose']
      // compareMode: 'checksum',
      // syncDest: true,
      // progress: true,
    }));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(config.js.src, ['js']);
  gulp.watch(config.img.src, ['img']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'js', 'img']);