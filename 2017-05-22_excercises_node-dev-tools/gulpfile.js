const gulp = require('gulp');
const minifyHtml = require('gulp-htmlmin');

gulp.task('minify-html', () => {
    "use strict";
    gulp
        .src(`./views/*.css`)
        .pipe(minifyHtml({collapseWhitespace: true}))
        .pipe(gulp.dest(`./views`));
});