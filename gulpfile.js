const { src, dest, parallel, watch, series } = require("gulp");
const concat = require("gulp-concat");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const pug = require("gulp-pug");

const FilePath = {
  sassFiles: "src/scss/*.scss",
  jsFiles: "src/js/*.js",
  htmlFiles: "src/pug/pages/*.pug",
};

const { sassFiles, jsFiles, htmlFiles } = FilePath;

function sassTask() {
  return src(sassFiles)
    .pipe(sass())
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

function htmlTask() {
  return src(htmlFiles)
    .pipe(pug({ pretty: true }))
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

function jsTask() {
  return src(jsFiles).pipe(concat("all.js")).pipe(dest("dist/js"));
}

function assetsTask() {
  return src("assets/**/*").pipe(dest("dist/assets"));
}

function serve() {
  browserSync.init({ server: { baseDir: "./dist" } });
  watch("./src/scss/**/*.scss", sassTask);
  watch("./src/js/**/*.js", jsTask);
  watch("./src/pug/**/*.pug", htmlTask);
}

exports.js = jsTask;
exports.sass = sassTask;
exports.html = htmlTask;
exports.assets = assetsTask;
exports.default = series(parallel(htmlTask, sassTask, jsTask, assetsTask));
exports.serve = series(serve, parallel(htmlTask, sassTask, jsTask, assetsTask));
