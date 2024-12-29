const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myAPI", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  getStatistics: () => console.log("first"),
});
