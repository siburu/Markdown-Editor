var app = require('app');
var BrowserWindow = require('browser-window');

var ipc = require('ipc');
var fs = require('fs');
var marked = require('marked');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
	// If unconditionally quiting, it's more convenient, but one error is printed on console...
	if (process.platform != 'darwin') {
		app.quit();
	}
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 800, height: 600});
	mainWindow.loadUrl('file://' + __dirname + '/index.html');
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});

ipc.on('marked-data-request', function(event) {
	rawData = fs.readFileSync(process.env['DATA']).toString();
	markedData = marked(rawData);
	event.sender.send('marked-data-response', markedData);
});
