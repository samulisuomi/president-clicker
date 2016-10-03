const gulp = require("gulp");
const inline = require("gulp-inline");
const uglify = require("gulp-uglify");
const autoprefixer = require("gulp-autoprefixer");
const clean = require("gulp-clean");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");

var bases = {
    client: "client/",
    dist: "dist",
};

var paths = {
    scripts: ["scripts/**/*.js"],
    styles: ["styles/**/*.css"],
    html: ["index.html", "404.html"],
    images: ["images/**/*.png", "images/**/*.svg"],
};

// Delete the dist directory
gulp.task("clean", function() {
    return gulp.src(bases.dist)
        .pipe(clean());
});

// Process scripts and concatenate them into one output file
gulp.task("scripts", ["clean"], function() {
    gulp.src(paths.scripts, {
            cwd: bases.client
        })
        .pipe(uglify())
        .pipe(concat("client.min.js"))
        .pipe(gulp.dest(bases.dist + "scripts/"));
});

// Imagemin images and ouput them in dist
gulp.task("imagemin", ["clean"], function() {
    gulp.src(paths.images, {
            cwd: bases.client
        })
        .pipe(imagemin())
        .pipe(gulp.dest(bases.dist + "images/"));
});

// Copy all other files to dist directly
gulp.task("copy", ["clean"], function() {
    // Copy html
    gulp.src(paths.html, {
            cwd: bases.client
        })
        .pipe(gulp.dest(bases.dist));

    // Copy styles
    gulp.src(paths.styles, {
            cwd: bases.client
        })
        .pipe(gulp.dest(bases.dist + "styles"));

    // Copy lib scripts, maintaining the original directory structure
    gulp.src(paths.libs, {
            cwd: "client/**"
        })
        .pipe(gulp.dest(bases.dist));

    // Copy extra html5bp files
    gulp.src(paths.extras, {
            cwd: bases.client
        })
        .pipe(gulp.dest(bases.dist));
});

// A development task to run anytime a file changes
gulp.task("watch", function() {
    gulp.watch("client/**/*", ["scripts", "copy"]);
});

// Define the default task as a sequence of the above tasks
gulp.task("default", ["clean", "scripts", "imagemin", "copy"]);
return gulp.src("client/index.html")
    .pipe(inline({
        base: "public/",
        js: uglify,
        css: [minifyCss, autoprefixer({
            browsers: ["last 2 versions"]
        })],
        disabledTypes: ["svg", "img", "js"], // Only inline css files
        ignore: ["./css/do-not-inline-me.css"]
    }))
    .pipe(gulp.dest("dist/"));
