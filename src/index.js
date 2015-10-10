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
	if (child) child.kill();

	if (!file.isDirectory())
	{
		cb(new gutil.PluginError("gulp-run-electron", "vinyl file is not a folder!"));
		return;
	}

	var errored = false;
	child = proc.spawn(electron, args.concat(file.path), opts);
	child.on("error", function(err)
	{
		cb(new gutil.PluginError("gulp-run-electron", err));
		errored = true;
	});

	if (!errored) cb(null, file);
}

module.exports = function(_args, _opts)
{
	args = _args || [];
	opts = _opts || {};
	// show colors in output
	opts.stdio = opts.stdio || "inherit";
	return through.obj(function(_file, enc, cb)
	{
		file = _file;
		spawn(cb);
	});
};

module.exports.rerun = function(cb)
{
	spawn(typeof cb === "function" ? cb : function() {});
};
