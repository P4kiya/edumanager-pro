const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

// Configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // Allow loading HTTPS resources from file:// (avatars, etc.)
    },
    autoHideMenuBar: true,
    backgroundColor: "#0a0f1c", // Prevent white flash before React renders
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:8080");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "dist", "index.html"));
  }

  // Log renderer errors to help diagnose blank/white pages
  win.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
    log.error(`Page failed to load: ${errorDescription} (${errorCode}) — ${validatedURL}`);
  });

  win.webContents.on("render-process-gone", (event, details) => {
    log.error(`Renderer process gone: ${details.reason}`);
    // Reload the app when renderer crashes
    if (process.env.NODE_ENV === "development") {
      win.loadURL("http://localhost:8080");
    } else {
      win.loadFile(path.join(__dirname, "dist", "index.html"));
    }
  });

  // Trigger update check on window creation
  autoUpdater.checkForUpdates();
}

app.whenReady().then(() => {
  createWindow();



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

autoUpdater.on("download-progress", (progressObj) => {
  log.info("Progress object:", JSON.stringify(progressObj));
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message = log_message + " (" + progressObj.transferred + "/" + progressObj.total + ")";
  log.info(log_message);
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send("download-progress", progressObj);
  });
});

autoUpdater.on("error", (err) => {
  log.error("Update error: " + err);
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send("update-error", err.message || err.toString());
  });
});

// IPC handlers
ipcMain.on("download-update", () => {
  autoUpdater.downloadUpdate();
});

ipcMain.on("restart-app", () => {
  autoUpdater.quitAndInstall();
});

// Duplicates removed

// ipcMain.on("check-updates"...) is now handled inside createWindow logic or above
// Keeping other handlers


ipcMain.handle("get-version", () => {
  return app.getVersion();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

