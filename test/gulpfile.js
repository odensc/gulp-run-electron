var gulp = require("gulp");
var runElectron = require("../src");

gulp.task("watch", function()
{
	return gulp.watch("app/**/*", ["build", runElectron.rerun]);
});

gulp.task("build", function()
{
	return gulp.src("app/**/*").pipe(gulp.dest("build"));
});

gulp.task("default", ["watch", "build"], function()
{
	return gulp.src("build").pipe(runElectron());
});
