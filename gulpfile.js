const gulp = require('gulp');
const sass = require('gulp-sass')(require('dart-sass'));
const pug = require('gulp-pug');
const plumber = require( 'gulp-plumber');
const notifier = require('node-notifier');
const browserSync = require('browser-sync').create();
var clean = require('gulp-clean');
// Styles
gulp.task('styles', function( done) {
    return gulp.src('src/styles/**/*.scss')
      .pipe( plumber())
      .pipe(sass({ style: 'expanded' })
      .on( 'error', function( error) {
            notifier.notify({title: "SCSS error", message: error.message});
            console.error( "\n\n", error.message, "\n\n");
      })
      .on('error', sass.logError))
      .pipe(gulp.dest('dist/styles'))
      .pipe(browserSync.stream())
  });

  
gulp.task( "templates", function( done) {
      return gulp.src('src/pug/views/*.pug')
      .pipe(plumber())      
      .pipe(
        pug({
          verbose: true,
          basedir: 'src/pug/views',
        }))
      .on( 'error', function( error) {
            notifier.notify({title: "Pug error", message: error.message});
            console.error( "\n\n", error.message, "\n\n");
      })        
      .pipe(gulp.dest('./dist'))
      .pipe(browserSync.stream())
});

// Watch
gulp.task('watch', function() {
      gulp.watch('src/pug/**/*.pug', gulp.series('templates'));      
      gulp.watch('src/styles/**/*.scss', gulp.series('styles'));      
      browserSync.init({
            open:  true ,
            server: {
                baseDir: "./dist"
            }
        });
      
});

gulp.task('clean', function(cb) {
      return gulp.src(['dist/**/*.html', 'dist/styles/**/*.css'], {read: false})
      .pipe(clean());
});

// Watch
gulp.task('default', gulp.series( 'templates','styles', 'watch', function() {
      console.log( "server started");
}));

