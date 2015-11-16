"use strict";
import gulp from "gulp";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import merge from "merge2";
process.env.FORCE_COLOR = true;
gulp.task("js", () => {
	let streams = [];
	for (let moduleType of ["amd", "commonjs", "systemjs", "umd"]) {
		streams.push(gulp.src("src/**/*.js")
			.pipe(babel({
				presets: ["es2015", "stage-0"],
				plugins: [`transform-es2015-modules-${moduleType}`]
			}))
			.pipe(uglify({
				mangle: true
			}))
			.pipe(gulp.dest(`dist/${moduleType}`)));
	}
	return merge(streams);
});
gulp.task("default", () => {
	gulp.start(["js"]);
});