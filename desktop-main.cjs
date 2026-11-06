const { app, BrowserWindow, dialog } = require('electron');
const os = require('node:os');

const PORT = Number(process.env.PORT || 3000);
let mainWindow;

function lanAddresses() {
  return Object.values(os.networkInterfaces()).flatMap(items => items || [])
    .filter(item => item.family === 'IPv4' && !item.internal)
    .map(item => `http://${item.address}:${PORT}/`);
}

async function waitForServer() {
  const url = `http://127.0.0.1:${PORT}/api/health`;
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Pleniora AI did not start on port ${PORT}.`);
}

function makeWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1050,
    minHeight: 700,
    title: 'Pleniora AI',
    backgroundColor: '#f4f5f7',
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  mainWindow.loadURL(`http://127.0.0.1:${PORT}/login.html`);
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(async () => {
  process.env.HOST = '0.0.0.0';
  process.env.PORT = String(PORT);
  process.env.RIDA_DATA_DIR = `${app.getPath('userData')}\\data`;
  require('./server.js');
  try {
    await waitForServer();
    makeWindow();
    const addresses = lanAddresses();
    if (addresses.length) {
      mainWindow.webContents.on('did-finish-load', () => {
        const hint = JSON.stringify(`Phone access on the same Wi-Fi: ${addresses.join('  |  ')}`);
        mainWindow.webContents.executeJavaScript(`const n=document.getElementById('cloudStatus');if(n)n.title=${hint}`);
      });
    }
  } catch (error) {
    dialog.showErrorBox('Pleniora AI', `${error.message}\nIf port ${PORT} is busy, close the other local server and restart.`);
    app.quit();
  }
});

app.on('window-all-closed', () => app.quit());
