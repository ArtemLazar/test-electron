const { app, BrowserWindow, Tray } = require('electron');
const { autoUpdater } = require('electron-updater');
const os = require('os-utils');
const path = require('path');

let mainWindow;

const dispatch = (data) => {
    mainWindow.webContents.send('message', data);
};

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: __dirname + '/images/icon.png'
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

app.on('ready', () => {
    createWindow();

    const tray = new Tray(__dirname + '/images/icon.png');
    tray.setToolTip('CPU Monitor');

    autoUpdater.checkForUpdatesAndNotify();

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('version', app.getVersion())
    })
});

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

autoUpdater.on('checking-for-update', () => {
    dispatch('Checking for update...');
});

autoUpdater.on('update-available', () => {
    dispatch('Update available.');
});

autoUpdater.on('update-not-available', () => {
    dispatch('Update not available.');
});

autoUpdater.on('error', (err) => {
    dispatch('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('download-progress', progressObj.percent);
});

autoUpdater.on('update-downloaded', () => {
    dispatch('Update downloaded');
});
