// const { app, BrowserWindow } = require("electron");
// const path = require("path");
// const { spawn, fork } = require("child_process"); // Added fork

// // Dynamic import for get-port
// let getPort;
// import("get-port").then((mod) => {
//   getPort = mod.default;
// });

// let mainWindow;
// let nextServerProcess;

// const isDev = !app.isPackaged;

// async function runScript(scriptName, statusMsg) {
//   if (mainWindow) {
//     mainWindow.webContents.send("update-status", statusMsg);
//   }
  
//   return new Promise((resolve, reject) => {
//     // Resolve path depending on Dev or Prod environment
//     // Dev: apps/demo/system_info.cjs
//     // Prod: resources/system_info.cjs (we will configure this copy in package.json)
//     const scriptPath = app.isPackaged 
//         ? path.join(process.resourcesPath, scriptName)
//         : path.join(__dirname, "..", scriptName);

//     // Set Working Directory so scripts find .env and public/ folder
//     // Dev: apps/demo
//     // Prod: resources/standalone (where Next.js server lives)
//     const cwd = app.isPackaged 
//         ? path.join(process.resourcesPath, "standalone")
//         : path.join(__dirname, "..");

//     console.log(`[Electron] Running script: ${scriptPath}`);

//     const child = fork(scriptPath, [], {
//         cwd,
//         env: { ...process.env }
//     });

//     child.on('exit', (code) => {
//         if (code === 0) resolve();
//         else {
//             console.error(`Script ${scriptName} failed.`);
//             // Resolve anyway to let app continue even if scan fails
//             resolve(); 
//         }
//     });
//   });
// }

// async function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1280,
//     height: 800,
//     show: false, // Hide initially until loaded
//     backgroundColor: '#121212',
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//       preload: path.join(__dirname, "preload.cjs"),
//     },
//   });

//   // 1. Load the Loading Screen
//   await mainWindow.loadFile(path.join(__dirname, "scanning.html"));
//   mainWindow.show();

//   // 2. Perform Background Tasks
//   try {
//       // Small delay to let UI render
//       await new Promise(r => setTimeout(r, 1000));
      
//       await runScript("system_info.cjs", "Detecting Hardware Configuration...");
//       await runScript("laptop_res.cjs", "Analyzing Specifications with AI...");
      
//       mainWindow.webContents.send("update-status", "Starting Avatar Interface...");
//       await new Promise(r => setTimeout(r, 800)); // Visual delay
//   } catch (err) {
//       console.error("Initialization failed", err);
//   }

//   // 3. Switch to Main Application
//   if (isDev) {
//     mainWindow.loadURL("http://localhost:3000");
//   } else {
//     const port = await startNextJSServer();
//     mainWindow.loadURL(`http://localhost:${port}`);
//   }

//   mainWindow.on("closed", () => {
//     mainWindow = null;
//   });
// }

// async function startNextJSServer() {
//   if (!getPort) {
//     const mod = await import("get-port");
//     getPort = mod.default;
//   }
  
//   const port = await getPort();
//   const serverPath = path.join(process.resourcesPath, "standalone", "server.js");
  
//   console.log("Starting local Next.js server at:", serverPath);

//   nextServerProcess = spawn(process.execPath, [serverPath], {
//     env: {
//       ...process.env,
//       PORT: port.toString(),
//       HOSTNAME: "localhost",
//       NODE_ENV: "production",
//     },
//     // Important for prod: Run server in standalone dir so it finds public/
//     cwd: path.join(process.resourcesPath, "standalone") 
//   });

//   nextServerProcess.stdout.on("data", (data) => console.log(`Next.js: ${data}`));
//   nextServerProcess.stderr.on("data", (data) => console.error(`Next.js Error: ${data}`));

//   await new Promise((resolve) => setTimeout(resolve, 2000));
//   return port;
// }

// app.on("ready", createWindow);

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") app.quit();
// });

// app.on("will-quit", () => {
//   if (nextServerProcess) nextServerProcess.kill();
// });

































const { app, BrowserWindow, ipcMain } = require("electron"); // Added ipcMain
const path = require("path");
const { spawn, fork } = require("child_process");

// Dynamic import for get-port
let getPort;
import("get-port").then((mod) => {
  getPort = mod.default;
});

let mainWindow;
let nextServerProcess;

const isDev = !app.isPackaged;

async function runScript(scriptName, statusMsg) {
  if (mainWindow) {
    mainWindow.webContents.send("update-status", statusMsg);
  }
  
  return new Promise((resolve, reject) => {
    const scriptPath = app.isPackaged 
        ? path.join(process.resourcesPath, scriptName)
        : path.join(__dirname, "..", scriptName);

    const cwd = app.isPackaged 
        ? path.join(process.resourcesPath, "standalone")
        : path.join(__dirname, "..");

    console.log(`[Electron] Running script: ${scriptPath}`);

    const child = fork(scriptPath, [], {
        cwd,
        env: { ...process.env }
    });

    child.on('exit', (code) => {
        resolve(); // Resolve even on error to keep flow moving
    });
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    backgroundColor: '#121212',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  // 1. Load Scanning Screen (Hardware Scan)
  await mainWindow.loadFile(path.join(__dirname, "scanning.html"));
  mainWindow.show();

  // Run Backend Scripts
  try {
      await new Promise(r => setTimeout(r, 1000));
      await runScript("system_info.cjs", "Detecting Hardware Configuration...");
      await runScript("laptop_res.cjs", "Analyzing Specifications with AI...");
      mainWindow.webContents.send("update-status", "Initializing Biometric Sensors...");
      await new Promise(r => setTimeout(r, 1000));
  } catch (err) {
      console.error("Initialization failed", err);
  }

  // 2. Load Face Detection Screen
  await mainWindow.loadFile(path.join(__dirname, "detect.html"));
}

// 3. Handle "Face Detected" Event -> Launch Avatar
ipcMain.on("face-detected", async () => {
  console.log("[Electron] Face verified. Launching Avatar Session...");
  
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    const port = await startNextJSServer();
    mainWindow.loadURL(`http://localhost:${port}`);
  }
});

async function startNextJSServer() {
  if (!getPort) {
    const mod = await import("get-port");
    getPort = mod.default;
  }
  
  const port = await getPort();
  const serverPath = path.join(process.resourcesPath, "standalone", "server.js");
  
  console.log("Starting local Next.js server at:", serverPath);

  nextServerProcess = spawn(process.execPath, [serverPath], {
    env: {
      ...process.env,
      PORT: port.toString(),
      HOSTNAME: "localhost",
      NODE_ENV: "production",
    },
    cwd: path.join(process.resourcesPath, "standalone") 
  });

  nextServerProcess.stdout.on("data", (data) => console.log(`Next.js: ${data}`));
  nextServerProcess.stderr.on("data", (data) => console.error(`Next.js Error: ${data}`));

  await new Promise((resolve) => setTimeout(resolve, 2000));
  return port;
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
  if (nextServerProcess) nextServerProcess.kill();
});






