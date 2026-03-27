#!/bin/bash

function maincjs() {
  touch main.cjs
  
  cat > main.cjs << EOF
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
EOF
}

function instructions() {
  echo "Now the main.cjs the entry point for your Electron app has been created. \n
  in the vite.config.ts file, make sure to add the following configuration (base) to ensure proper asset loading in production builds:"
  echo "server: {
    host: "::",
    port: 8080,
  },
  base: './', // <--- Ensure relative paths for assets add this
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },"

  echo "In the package.json, ensure you have the following scripts to run and build your Electron app:"
  echo '''{
  "name": "vite_react_shadcn_ts",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "main": "main.cjs",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview",
    "electron": "electron .",
    "dist": "npm run build && electron-builder"
  },
  "devDependencies": {
    ...
    "electron": "^26.2.0",
    "electron-builder": "^24.6.0",
    ...
  },
  "build": {
    "appId": "com.yourapp.id",
    "productName": "Niyo",  
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "main.cjs",
      "package.json"
    ],
    "win": {
      "target": "nsis",
      "icon": "dist/favicon.ico" 
    }
  }
  '''
}

echo "Starting to execute the desktop commands"
cd desktop
if [ ! -d "node_modules" ]; then
  echo "node_modules directory not found. Installing dependencies..."
  npm install
else
  echo "node_modules directory found. Skipping npm install."
fi
maincjs
echo "Finished executing the desktop commands"
instructions

echo "Please review and update the main.cjs, vite.config.ts, and package.json files as needed."
read -p "After completing the changes, press type 'build' to build the Electron app or 'exit' to quit: " user_input
if [ "$user_input" == "build" ]; then
  echo "Building the Electron app..."
  npm run dist
  echo "Build process completed. Check the 'release' folder for the output."
else
  echo "Exiting without building the Electron app."
fi