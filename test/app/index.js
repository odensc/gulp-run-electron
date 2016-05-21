var app = require("electron").app;
var BrowserWindow = require("electron").BrowserWindow;

var mainWindow = null;

app.on("ready", function()
{
	mainWindow = new BrowserWindow({width: 800, height: 600});
	mainWindow.loadURL("file://" + __dirname + "/index.html");
	mainWindow.openDevTools();

	mainWindow.on("closed", function()
	{
		mainWindow = null;
	});
	
	console.log("Output");
});
