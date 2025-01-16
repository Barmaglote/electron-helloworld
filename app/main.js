const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('app/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.on('toMain', (event, args) => {
    console.log('Message from renderer:', args);
    event.sender.send('fromMain', 'Hello from main process!');
  });

  ipcMain.handle('ping', () => 'pong');
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

require('electron-reload')(path.join(__dirname), {
  electron: require(`${__dirname}/../node_modules/electron`),
});