var through = require("through2");
var electron = require("electron");
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

	function print(data)
	{
		var str = data.toString().trim();
		if (str)
			gutil.log("[electron] " + str);
	}

	child.stdout.on("data", print);
	child.stderr.on("data", print);

	if (!errored) cb(null, file);
}

module.exports = function(_args, _opts)
{
	args = _args || [];
	opts = _opts || {};
	// show colors in output
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
