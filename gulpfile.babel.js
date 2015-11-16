"use strict";
import gulp from "gulp";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
process.env.FORCE_COLOR = true;
gulp.task("js", () => {
	return gulp.src("src/**/*.js")
		.pipe(babel({
			presets: ["es2015", "stage-0"],
			plugins: ["transform-es2015-modules-systemjs"]
		}))
		.pipe(uglify({
			mangle: true,
		}))
		.pipe(gulp.dest("dist"));
});
gulp.task("default", () => {
	gulp.start(["js"]);
});