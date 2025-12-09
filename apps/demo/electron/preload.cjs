const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onUpdateStatus: (callback) => ipcRenderer.on("update-status", (_event, value) => callback(value)),
  // New method for face detection
  faceDetected: () => ipcRenderer.send("face-detected"),
});