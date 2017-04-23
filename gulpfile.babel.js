import gulp from "gulp";
import babel from "gulp-babel";
export function js() {
	return gulp.src("src/**/*.js")
		.pipe(babel())
		.pipe(gulp.dest("dist"));
}
export default gulp.parallel(js);