const {app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')

const url = require('url');
const path = require('path');

let mainWindow

function createWindow() {

    mainWindow = new BrowserWindow({

        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    })

    mainWindow.loadURL(
      
        url.format({
            pathname: path.join(__dirname, `/dist/index.html`),
            protocol: "file:",
            slashes: true
        })
    );

    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function() {
        mainWindow = null
    })
}


app.on('ready', function() {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
    if(mainWindow === null) createWindow()
})

autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
})