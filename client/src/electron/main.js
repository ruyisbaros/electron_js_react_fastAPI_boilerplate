import { app, BrowserWindow, Tray, Menu } from "electron";
import path from "path";
import url from "url";
import process from "process";

let mainWindow;
let tray;
const trayIconPath = path.join(app.getAppPath(), "public/assets/logo_3_16.png");
console.log(trayIconPath);
const isDev = !app.isPackaged; // Check if the app is running in development

/* GET PRELOAD JS */
function getPreloadPath() {
  const isDev = !app.isPackaged;
  return isDev
    ? path.join(app.getAppPath(), "src/electron/preload.cjs")
    : path.join(app.getAppPath(), "preload.cjs");
}
console.log("Preload Path:", getPreloadPath());

/* CREATE MAIN WINDOW */
function createWindow() {
  mainWindow = new BrowserWindow({
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
  tray = new Tray(trayIconPath); // Replace with your icon
  tray.setToolTip("Translation Service");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: "Start Translation",
      click: () => {
        console.log("Translation started");
        // Add logic to start translation here
      },
    },
    {
      label: "Stop Translation",
      click: () => {
        console.log("Translation stopped");
        // Add logic to stop translation here
      },
    },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  // Optional: Double-click to show the app
  tray.on("double-click", () => {
    mainWindow.show();
  });
  mainWindow.on("minimize", (event) => {
    event.preventDefault();
    mainWindow.hide(); // Minimize to Tray
  });

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide(); // Hide the window instead of quitting
  });
}

/* CREATE TRAY */
function createTray() {
  tray = new Tray(trayIconPath); // Replace with your icon
  tray.setToolTip("Translation Service");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: "Start Translation",
      click: () => {
        console.log("Translation started");
        // Add logic to start translation here
      },
    },
    {
      label: "Stop Translation",
      click: () => {
        console.log("Translation stopped");
        // Add logic to stop translation here
      },
    },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  // Optional: Double-click to show the app
  tray.on("double-click", () => {
    mainWindow.show();
  });
}

/* INVOKE WINDOWS*/
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
