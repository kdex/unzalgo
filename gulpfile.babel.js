import gulp from "gulp";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
export function js() {
	return gulp.src("src/**/*.js")
		.pipe(babel())
		.pipe(uglify({
			mangle: true
		}))
		.pipe(gulp.dest("dist"));
}
export default gulp.parallel(js);