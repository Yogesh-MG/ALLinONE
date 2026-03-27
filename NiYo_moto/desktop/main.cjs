const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    // 1. Set the Window Icon (shows in taskbar and top-left of window)
    // Ensure you have a file named 'icon.png' (or .ico) in your root folder
    icon: path.join(__dirname, 'icon.png'),
    // 2. Set the default title (optional, usually overridden by index.html title)
    title: "My Custom App Name", 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, 
    },
  });

  // 3. Remove the top menu bar (File, Edit, View, etc.)
  mainWindow.setMenu(null);

  if (!app.isPackaged) {
    // DEVELOPMENT
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // PRODUCTION
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});