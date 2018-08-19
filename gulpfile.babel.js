'use strict';

// import needed plugins
import gulp from 'gulp';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import sourceMaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import minimizeCSS from 'gulp-clean-css';

// test gulp
gulp.task('test', () => console.log('teeeest: gulp is alive :)'));

// base directories
const dirs = {
    src: 'src',
    prod: 'prod'
}

// paths to sourse file and production destinations
const paths = {
    css: `${dirs.src}/css/**/*.css`,
    scss: `${dirs.src}/scss/**/*.+(scss|sass)`,
    js: `${dirs.src}/js/**/*.js`,
    html: `${dirs.src}/*.html`,
    prod: dirs.prod
};

// set style file order (for concating)
const cssFiles = [
    `${dirs.src}/css/style.css`,
    paths.css
];

// converts scss -> css  
gulp.task('scss', () => {
    return gulp.src(paths.scss) // take file from this path
        .pipe(sourceMaps.init) // activate sourcemaps
        .pipe(sass().on('error', sass.logError)) // implement sass converter
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(paths.css)) // save the result to the destination
        .pipe(browserSync.reload({ // reload browser
            stream: true
        }));
});

// whatcher for watching on changes in source files and autorun needed "gulp-scripts"
gulp.task('watch', ['browserSync'], () => { // first run browserSync then watch
    gulp.watch(paths.scss, ['scss']);
    gulp.watch(paths.html, browserSync.reload);
});

// syncs changes in source files  
gulp.task('browserSync', () => {
    browserSync({
        server: {
            baseDir: dirs.src // init server root der (where index.html exists)
        }
    });
});

// concats all the css files  
gulp.task('prodCSS', () => {
    return gulp.src(cssFiles)                       // take file from this path
        .pipe(sourceMaps.init({loadMaps: true}))    // activate sourcemaps
        .pipe(concat('main.min.css'))               // save the result to the destination
        .pipe(minimizeCSS())                        // delete spaces and etc.
        .pipe(sourceMaps.write('.'))                // write sourcemaps
        .pipe(gulp.dest(paths.prod));               // save the result to the destination
});

// task by default (so we don't need to use task name after 'npm run gulp')
gulp.task('default', ['prodCSS']);
//gulp.task('default', ['sass', 'watch']);