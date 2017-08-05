var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    autoprefixer = require('gulp-autoprefixer'),
    cache = require('gulp-cache');


var sassPuth = 'app/sass/**/*.+(scss|sass)';

gulp.task('sass', function(){
    return gulp.src(sassPuth)
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}));

});


// gulp.task('scripts', function(){
//     return gulp.src([
//         'app/libs/jquery/jquery.min.js',
//         'app......js',
//     ])
//      .pipe(concat('libs.min.js'))
//      .pipe(uglify())
//      .pipe('app/js');
// })

gulp.task('css-libs',['sass'], function(){
    return gulp.src('app/css/*.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'));
})

gulp.task('browser-sync',function(){
    browserSync({
        server: {
           baseDir: 'app'
        }
    });
});


gulp.task('img',function(){
    return gulp.src("app/img/**/*")
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        une: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});


gulp.task('watch', ['browser-sync','css-libs'/*,'scripts'*/], function(){
    gulp.watch(sassPuth, ['sass']);
    gulp.watch('app/**/*.html', browserSync.reload);
     gulp.watch('app/js/**/*.js', browserSync.reload);
});



gulp.task('clean',function(){
    return del.sync('dist');
});

gulp.task('clear',function(){
    return cache.clearAll();
});


gulp.task('build',['clean','img','sass'],function(){
    var buildCSS = gulp.src('app/css/*.min.css')
    .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

     var buldHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

});