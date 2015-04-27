var through = require("through2");
var electron = require("electron-prebuilt");
var gutil = require("gulp-util");
var spawn = require("child_process").spawn;

module.exports = function(args, opts)
{
	return through.obj(function(file, enc, cb)
	{
		function done(err)
		{
			if (!called)
			{
				cb(null, file);
				called = true;
			}
		}

		if (!file.isDirectory())
		{
			cb(new gutil.PluginError("gulp-run-electron", "vinyl file is not a folder!"));
			return;
		}

		var called = false;
		var child = spawn(electron, (args || []).concat(file.path), opts || {});
		child.on("error", function(err)
		{
			done(new gutil.PluginError("gulp-run-electron", err));
		});

		child.stdout.on("data", function(data)
		{
			gutil.log("Electron:", data.toString("utf8"));
			done(null);
		});

		// chrome INFO goes in stderr for some reason
		child.stderr.on("data", function(data)
		{
			gutil.log("Electron:", data.toString("utf8"));
			done(null);
		});
	});
};
