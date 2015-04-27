var through = require("through2");
var electron = require("electron-prebuilt");
var gutil = require("gulp-util");
var proc = require("child_process");

var child = null;
var args = null;
var opts = null;
var file = null;

function spawn(cb)
{
	function done(err)
	{
		if (!called)
		{
			cb(null, file);
			called = true;
		}
	}

	if (child) child.kill();

	if (!file.isDirectory())
	{
		cb(new gutil.PluginError("gulp-run-electron", "vinyl file is not a folder!"));
		return;
	}

	var called = false;
	child = proc.spawn(electron, (args || []).concat(file.path), opts || {});
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
}

module.exports = function(_args, _opts)
{
	args = _args;
	opts = _opts;
	return through.obj(function(_file, enc, cb)
	{
		file = _file;
		spawn(cb);
	});
};

module.exports.rerun = function()
{
	spawn(function() {});
};
