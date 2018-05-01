var through = require("through2");
var electron = require("electron");
var gutil = require("gulp-util");
var proc = require("child_process");

var child = null;
var args = null;
var opts = null;
var file = null;

function print(data)
{
	var str = data.toString().trim();
	if (str)
		gutil.log("[electron] " + str);
}

function spawn(cb)
{
	var errored = false;

	if (child) child.kill();

	if (!file.isDirectory())
	{
		cb(new gutil.PluginError("gulp-run-electron", "vinyl file is not a folder!"));
		return;
	}

	// Layer environment over existing environment (for linux)
	if (opts.env) {
		for (var key in process.env) {
			if (typeof opts.env[key] === "undefined") {
				opts.env[key] = process.env[key];
			}
		}
	}

	child = proc.spawn(electron, args.concat(file.path), opts);

	child.on("error", function(err)
	{
		cb(new gutil.PluginError("gulp-run-electron", err));
		errored = true;
	});

	child.stdout.on("data", print);
	child.stderr.on("data", print);

	if (!errored) cb(null, file);
}

module.exports = function(_args, _opts)
{
	args = _args || [];
	opts = _opts || {};

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
