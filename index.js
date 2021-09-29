const electron = require('electron');
const commands = require('./server/commands');
const path = require('path');

const {
	BrowserWindow,
	screen,
	app,
	ipcMain: ipc,
} = electron;

ipc.on('comsCommand', async (event, { command, data, id }) => {
	if (!commands[command]) {
		console.error('Unknown command', command);
		return;
	}
	
	const result = await commands[command](data);
	
	event.sender.send('comsResponse', {
		data: result,
		id
	});
});
 
app.on('ready', () => {
	const test = process.env.NODE_ENV === 'development';
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	let normalWidth = test ? width/2 + 300 : width/2;
	
	mainWindow = new BrowserWindow({
    	height: height/3,
    	width: normalWidth,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
  	});

	const htmlPath = path.join(__dirname, '/build/index.html');

	// load the local HTML file
	let url = require('url').format({
		protocol: 'file',
		slashes: true,
		pathname: htmlPath,
	})
	//console.log(url)
	mainWindow.loadURL(url)
	if (test) {
		mainWindow.webContents.openDevTools();
	}
})