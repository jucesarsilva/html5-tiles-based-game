var gulp        = require('gulp');
var gutil       = require('gulp-util');
var htmlmin     = require('gulp-html-minifier');
var uglify      = require("gulp-uglify");
var watch       = require("gulp-watch");
var jshint      = require("gulp-jshint");
var concat      = require("gulp-concat");
var cssmin      = require('gulp-cssmin');
var clean       = require('gulp-clean');



gulp.task("default", function () {
    gutil.log("Gulp is working!");
    //gulp.start('watch');
    gulp.start('uglify');
    gulp.start('minify-css');
    gulp.start('concat');
    gulp.start('remove');
});



gulp.task('jshint', function () {
    gutil.log('Starting jshint task.');
    return gulp.src('./js/**/**/**/**/**/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
gulp.task('uglify', function () {
    gutil.log('Starting uglify task.');
    return gulp.src([
        './js/lib/jquery-1.10.2.min.js',
        './js/lib/tweenJS/src/createjs/events/Event.js',
        './js/lib/tweenJS/src/createjs/events/EventDispatcher.js',
        './js/lib/tweenJS/src/tweenjs/Tween.js',
        './js/lib/tweenJS/src/tweenjs/Ease.js',
        './js/lib/tweenJS/examples/assets/easeljs-NEXT.min.js',
        './js/lib/pathfind/lib/pathfinding-browser.min.js',
        './js/class/FPSMeter.js',
        './js/class/*.js'
    ])
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});
gulp.task('minify-css', function () {
    gutil.log('Starting minify-css task.');
    return gulp.src(['./css/*.css'])
    .pipe(cssmin())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('./css'));
});
gulp.task('concat', ['uglify'], function() {
    gutil.log('Starting concat task.');
    return gulp.src('./dist/**/**/**/**/**/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./js'));
});
gulp.task('remove', ['uglify', 'concat'], function () {
    gutil.log('Starting remove task.');
    return gulp.src('./dist', {read: false}).pipe(clean());
});



gulp.task('watch', function () {
    gutil.log('Starting watch task.');
    gulp.watch('./js/*.js', function (event) {
        gutil.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start('jshint');
        gulp.start('uglify');
        gulp.start('minify-css');
        gulp.start('concat');
        gulp.start('remove');
    });
 });