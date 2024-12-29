import { app, BrowserWindow } from "electron";
import path from "path";
import url from "url";
import process from "process";
//import { pollResources } from "./resourceManager.js";

const isDev = process.env.NODE_ENV === "development";
function getPreloadPath() {
  const isDev = !app.isPackaged;
  return isDev
    ? path.join(app.getAppPath(), "src/electron/preload.cjs")
    : path.join(app.getAppPath(), "preload.cjs");
}
console.log("Preload Path:", getPreloadPath());
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: getPreloadPath(), // Ensure preload.js path is correct
      contextIsolation: true, // Recommended for security
      nodeIntegration: false, // Disable Node.js in the renderer process
      enableRemoteModule: false, // Avoid deprecated remote module
      sandbox: false, // Ensure sandboxing doesn’t block features
    },
  });
  if (isDev) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    const distPath = path.join(
      app.getAppPath(),
      "client/dist-react/index.html"
    );
    const fileUrl = url.pathToFileURL(distPath).toString();

    console.log(`Loading file: ${fileUrl}`);
    mainWindow.loadURL(fileUrl);
  }
  //pollResources();
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
