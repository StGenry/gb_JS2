'use strict';

// import needed plugins
import gulp from 'gulp';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import sourceMaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import minimizeCSS from 'gulp-clean-css'; // CSS compression
import rigger from 'gulp-rigger';
import minimizeJS from 'gulp-uglify'; // JS compression
import imagemin from 'gulp-imagemin'; // image compression
// import prefixer from 'gulp-autoprefixer'; // parse CSS and add vendor prefixes to CSS 

// test gulp
gulp.task('test', () => console.log('teeeest: gulp is alive :)'));

// base directories
const dirs = {
    src: 'src',
    prod: 'prod'
}

// paths to sourse files
const srcPaths = {
    css: `${dirs.src}/css/**/*.css`,
    scss: `${dirs.src}/scss/**/*.+(scss|sass)`,
    js: `${dirs.src}/js/**/*.js`,
    img: `${dirs.src}/img/**/*.*`,
    fonts: `${dirs.src}/fonts/**/*.*`,
    html: `${dirs.src}/*.html`
};

// production destinations
const prodPaths = {
    css: `${dirs.prod}/css`,
    scss: `${dirs.prod}/scss`,
    js: `${dirs.prod}/js`,
    img: `${dirs.prod}/img`,
    fonts: `${dirs.prod}/fonts`,
    html: dirs.prod,
    root: dirs
};

// set style file order (for concating)
const cssFiles = [
    `${dirs.src}/css/style.css`,
    srcPaths.css
];

// converts scss -> css  
gulp.task('scss', () => {
    return gulp.src(srcPaths.scss) // take file from this path
        .pipe(sourceMaps.init) // activate sourcemaps
        .pipe(sass().on('error', sass.logError)) // implement sass converter
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(srcPaths.css)) // save the result to the destination
        .pipe(browserSync.reload({ // reload browser
            stream: true
        }));
});

// whatcher for watching on changes in source files and autorun needed "gulp-scripts"
gulp.task('watch', ['browserSync'], () => { // first run browserSync then watch
    gulp.watch(srcPaths.scss, ['scss']);
    gulp.watch(srcPaths.html, browserSync.reload);
});

// syncs changes in source files  
gulp.task('browserSync', () => {
    browserSync({
        server: {
            baseDir: prodPaths.html // init server root der (where index.html exists)
        }
    });
});

// concats & compresses all the css files  
gulp.task('prodCSS', () => {
    return gulp.src(cssFiles) // take file from this path
        .pipe(sourceMaps.init({
            loadMaps: true
        })) // activate sourcemaps
        .pipe(concat('main.min.css')) // save the result to the destination
        .pipe(minimizeCSS()) // delete spaces and etc.
        .pipe(sourceMaps.write('.')) // write sourcemaps
        .pipe(gulp.dest(prodPaths.css))
        .pipe(browserSync.reload({
            stream: true
        })); // save the result to the destination
});

// concats  & compresses all the js files  
gulp.task('prodJS', () => {
    return gulp.src(srcPaths.js) // take file from this path
        .pipe(sourceMaps.init({
            loadMaps: true
        })) // activate sourcemaps
        .pipe(concat('main.min.js')) // save the result to the destination
        .pipe(rigger())
        .pipe(minimizeJS()) // delete spaces and etc.
        .pipe(sourceMaps.write('.')) // write sourcemaps
        .pipe(gulp.dest(prodPaths.js)); // save the result to the destination
});

// just copy fonts to prod
gulp.task('prodFonts', () => {
    gulp.src(srcPaths.fonts)
        .pipe(gulp.dest(prodPaths.fonts));
});

// image compression
gulp.task('prodIMG', () => {
    gulp.src(srcPaths.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(prodPaths.img))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// 
gulp.task('prodHTML', () => {
    gulp.src(srcPaths.html)
        .pipe(rigger()) // add imports to HTML
        .pipe(gulp.dest(prodPaths.html))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// builds the prod
gulp.task('build', [
    'prodHTML',
    'prodJS',
    'prodCSS',
    'prodFonts',
    'prodIMG'
]);

// task by default (so we don't need to use task name after 'npm run gulp')
gulp.task('default', ['build']);

// task for prod-demo
//gulp.task('default', ['build', 'watch']);