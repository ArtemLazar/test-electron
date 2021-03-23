const { app, BrowserWindow } = require('electron');
const os = require('os-utils');
const path = require('path');

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    setInterval(() => {
        os.cpuUsage((v) => {
            mainWindow.webContents.send('cpu', v * 100);
            mainWindow.webContents.send('mem', os.freememPercentage() * 100);
            mainWindow.webContents.send('total-mem', os.totalmem() / 1024);
        });
    }, 1000);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
