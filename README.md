# gulp-run-electron
Gulp plugin for starting Electron.
Requires a peer dependency of `electron`.

## Usage
```js
var runElectron = require("gulp-run-electron");
gulp.src("app")
	.pipe(runElectron(["--cli-argument", "--another"], {cwd: "path"}));
```

### runElectron(args: array, opts: object)
Runs the electron executable on the src folder with the specified arguments, and
passes the opts object to child_process.spawn.

Both arguments are optional. If you only want to use the opts object, pass an
empty array for args.

### runElectron.rerun
For gulp.watch, exits Electron and opens it again; use like so:
```js
gulp.watch("files/*", ["files", runElectron.rerun]);
```
