const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

// Configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Ensure this matches your security needs; often set to true with preload
      enableRemoteModule: true,
    },
    autoHideMenuBar: true,
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:8080");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "dist", "index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  // Check for updates
  autoUpdater.checkForUpdatesAndNotify();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Auto-updater events
autoUpdater.on("update-available", () => {
  log.info("Update available.");
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send("update-available");
  });
});

autoUpdater.on("update-downloaded", () => {
  log.info("Update downloaded.");
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send("update-downloaded");
  });
});

// IPC handlers
ipcMain.on("restart-app", () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on("check-updates", () => {
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

