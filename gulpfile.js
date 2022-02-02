const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const sourceMaps = require('gulp-sourcemaps');
const imagemin = require("gulp-imagemin");
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
const del = require("del");
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');


function sass1() {
    return gulp.src('src/scss/style.scss')
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 version']
        }))
        .pipe(sourceMaps.write())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
}

gulp.task('sass', sass1);

gulp.task('html', html);

function html() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('build'))
        .pipe(browserSync.reload({
            stream: true
        }));
}

gulp.task('fonts', fonts);

function fonts() {
    return gulp.src('src/fonts/*.{eot,svg,ttf,wolf}')
        .pipe(gulp.dest('build/fonts'))
        .pipe(browserSync.reload({
            stream: true
        }));
}

gulp.task('js', js);

function js() {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
}

gulp.task('uglify', uglifyJs);

function uglifyJs () {
    return gulp.src("src/js/**/*.js")
        .pipe(rename("main.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build/js"));
}

gulp.task('css', css);

function css() {
    return gulp.src('src/css/**/*.css')
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
}

gulp.task('allimg', allimg);

function allimg() {
    return gulp.src('src/img/**/*.{png,jpg,JPG}')
        .pipe(gulp.dest('build/img'))
        .pipe(browserSync.reload({
            stream: true
        }));
}

gulp.task('images', images);

function images() {
    return gulp.src('build/img/**/*.{png,jpg,JPG}')
        .pipe(imagemin([
            imagemin.mozjpeg({progressive: true}),
            imageminJpegRecompress({
                loops: 5,
                min: 65,
                max: 70,
                quality: 'medium'
            }),
            imagemin.optipng({
                optimizationLevel: 3
            }),
            pngquant([
                {quality: '65-70'},
                {speed: 5}
            ])
        ]))
        .pipe(gulp.dest('build/img'));
}

gulp.task('svg', svg);

function svg() {
    return gulp.src('src/img/**/*.svg')
        .pipe(gulp.dest('build/img'));
}

gulp.task('serve', serve);

function serve() {
    browserSync.init({
        server: "build"
    });

    gulp.watch("src/scss/**/*.scss", gulp.parallel('sass'));
    gulp.watch("src/*.html", gulp.parallel("html"));
    gulp.watch("src/js/**/*.js", gulp.parallel('uglify'));
    gulp.watch("src/js/**/*.js", gulp.parallel("js"));
    gulp.watch("src/languages/*.json", gulp.parallel("i18n"));
    gulp.watch("src/css/**/*.css", gulp.parallel("css"));
    gulp.watch("src/img/**/*.{png,jpg,JPG}", gulp.parallel("allimg"));
    gulp.watch("src/img/**/*.{svg}", gulp.parallel("svg"));
}

gulp.task('i18n', i18n);

function i18n() {
    return gulp.src([
            'lib/jquery.i18n.git/src/*.js',
            'lib/jquery.i18n.git/libs/CLDRPluralRuleParser/src/CLDRPluralRuleParser.js',
            'src/languages/*.json'
        ])
        .pipe(gulp.dest('build/js/i18n'))
        .pipe(browserSync.reload({
            stream: true
        }));
}

gulp.task('copy', copy);

function copy() {
    return gulp.src([
            'img/**',
            'js/**',
            'css/**',
            'fonts/**',
            '*.html'
        ], {
            base: '.'
        })
        .pipe(gulp.dest('build'));

}

gulp.task('clean', clean);

function clean() {
    return del('build');
}

gulp.task('build', gulp.series('clean', 'sass', 'html', 'js', 'i18n', 'uglify', 'images', 'allimg', 'svg', 'fonts', 'copy'));
