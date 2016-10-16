var gulp = require("gulp"),
    runSequence = require("run-sequence"),
    clean = require("gulp-clean")
    inline = require("gulp-inline"),
    uglify = require("gulp-uglify"),
    cleanCss = require("gulp-clean-css"),
    autoprefixer = require("gulp-autoprefixer");

gulp.task("clean-dist", function() {
    return gulp.src("dist/", {
            read: false
        })
        .pipe(clean());
});

gulp.task("copy-images", function () {
  return gulp.src(["images/**/*"])
    .pipe(gulp.dest("dist/images")) // Outputs the file in the destination folder
})

gulp.task("copy-favicon", function () {
  return gulp.src(["*.ico", "*.png", "*.xml", "manifest.json", "*.svg"])
    .pipe(gulp.dest("dist/")) // Outputs the file in the destination folder
})

gulp.task("build", function() {
    return gulp.src("index.html")
        .pipe(inline({
            base: "/",
            js: uglify,
            css: [cleanCss({compatibility: "ie8"}), autoprefixer({
                browsers: ["last 2 versions"]
            })],
            disabledTypes: ["svg", "img"], // Only inline css files
            ignore: ["./css/do-not-inline-me.css"]
        }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("default", function(callback) {
    runSequence("clean-dist", ["build", "copy-images", "copy-favicon"],
        callback);
})
