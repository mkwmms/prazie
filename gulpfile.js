var gulp = require('gulp');
// var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var jpegtran = require('imagemin-jpegtran');
var cache = require('gulp-cached');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

// https://www.npmjs.com/package/favicons/

// sips -s format png *.* -
// ffor file in *.jpg; do sips -s format png $file --out $file.png; done

var paths = {
  scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
  images: ['client/images/**/*', 'client/profile/images/**/*']
  // images: 'client/images/**/*'
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use all packages 
// available on npm
gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['build'], cb);
});

gulp.task('scripts', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      // .pipe(coffee())
      .pipe(uglify())
      .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));
});

// Copy all static images
gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    // .pipe(cache(imagemin({ 
    //   optimizationLevel: 7, 
    //   progressive: true, 
    //   interlaced: true,
    //   use: [jpegtran()]
    // })))

  .pipe(imagemin({ 
        optimizationLevel: 7, 
        progressive: true, 
        interlaced: true,
        use: [jpegtran()]
      }))
    .pipe(gulp.dest('build/images'));
});

// // Reload Browser On File Change
// gulp.task('sync', function() {
//     browserSync.init( [buildDir + '**/*'], {
//         proxy: {
//             host: "localhost",
//             port: 8888
//         }
//     });
// });

// gulp.task('deploy', function() {
//     rsync({
//         ssh: true,
//         src: './build/',
//         dest: 'user@hostname:/path/to/www',
//         port: 22,
//         recursive: true,
//         syncDest: true,
//         compareMode: 'checksum',
//         args: ['--verbose']
//     }, function(error, stdout, stderr, cmd) {
//         notify({ message: stdout });
//     });
// });

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts', 'images']);