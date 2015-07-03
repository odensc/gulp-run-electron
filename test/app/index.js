var app = require("app");
var BrowserWindow = require("browser-window");

var mainWindow = null;

app.on("ready", function()
{
	mainWindow = new BrowserWindow({width: 800, height: 600});
	mainWindow.loadUrl("file://" + __dirname + "/index.html");
	mainWindow.openDevTools();

	mainWindow.on("closed", function()
	{
		mainWindow = null;
	});
});
