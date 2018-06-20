const gulp = require("gulp"),
    watch = require("gulp-watch"),
    browserSync = require("browser-sync"),
    del = require("del"),
    webp = require("gulp-webp"),
    uglify = require("gulp-uglify"),
    babel = require("gulp-babel"),
    es2015 = require("babel-preset-es2015"),
    pump = require("pump"),
    concat = require("gulp-concat"),
    htmlmin = require("gulp-htmlmin"),
    cleanCSS = require("gulp-clean-css"),
    autoprefixer = require("gulp-autoprefixer"),
    sourcemaps = require("gulp-sourcemaps"),
    runSequence = require("run-sequence"),
    strip = require("gulp-strip-comments");

gulp.task("default", ["watch"]);

gulp.task("browserSync", function() {
    browserSync({
        server: {
            baseDir: "app"
        }
    });
});

gulp.task("watch", ["browserSync"], function() {
    gulp.watch("app/css/**/*.css", ["minify-css"]);
    gulp.watch("img/**/*.jpg", ["webp"]);
    gulp.watch("app/js/**/*.js", ["compress"]);
    gulp.watch("app/*.html").on("minify", browserSync.reload);
});

gulp.task("webp", function() {
    return gulp.src("app/img/**/*.jpg")
        .pipe(webp())
        .pipe(gulp.dest("build/img"));
});

gulp.task("compress-main-js", function(cb) {
    pump([
            gulp.src(
                [
                    "app/js/lib/lazysizes.min.js",
                    "app/js/lib/idb.js",
                    "app/js/db/IndexController.js",
                    "app/js/db/dbhelper.js",
                    "app/js/main.js"
                ]
            ),
            babel({ presets: [es2015] }),
            uglify(),
            concat("main.js"),
            strip(),
            gulp.dest("build/js/")
        ],
        cb
    );
});

gulp.task("compress-restaurant_info-js", function(cb) {
    pump([
            gulp.src(
                [
                    "app/js/lib/serialize-0.2.min.js",
                    "app/js/lib/lazysizes.min.js",
                    "app/js/lib/idb.js",
                    "app/js/db/IndexController.js",
                    "app/js/db/dbhelper.js",
                    "app/js/restaurant_info.js"
                ]
            ),
            babel({ presets: [es2015] }),
            uglify(),
            concat("restaurant_info.js"),
            strip(),
            gulp.dest("build/js/")
        ],
        cb
    );
});

gulp.task("compress-sw-js", function(cb) {
    pump([
            gulp.src("app/sw.js"),
            babel({ presets: [es2015] }),
            uglify(),
            strip(),
            gulp.dest("build/")
        ],
        cb
    );
});

gulp.task("minify-css", () => {
    return gulp.src("app/css/**/*.css")
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write("."))
        .pipe(cleanCSS({ compatibility: "ie8" }))
        .pipe(gulp.dest("build/css/"));
});

gulp.task("minify", function() {
    return gulp.src("app/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
    del("build/*");
});

gulp.task("build", function() {
    runSequence("minify-css", "minify", "compress-main-js", "compress-restaurant_info-js", "compress-sw-js", "webp");
});