import { app, BrowserWindow } from "electron";
import path from "path";
import url from "url";
import process from "process";
import { pollResources } from "./resourceManager.js";

const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true, // Enabled web security
      allowFileAccess: true, // Allow file access
    },
  });
  if (isDev) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    const distPath = path.join(app.getAppPath(), "/dist-react/index.html");
    const fileUrl = url.pathToFileURL(distPath).toString();

    console.log(`Loading file: ${fileUrl}`);
    mainWindow.loadURL(fileUrl);
  }
  pollResources();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
