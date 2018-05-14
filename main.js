const electron = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('./RPC');

const { ipcMain } = require('electron');

const config = require('./src/config.json');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

let clientId = config.clientId;

DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

async function setActivity() {
  if (!rpc || !mainWindow) return;

  let details = await mainWindow.webContents.executeJavaScript(
    'var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("details")[text];'
  );
  let state = await mainWindow.webContents.executeJavaScript(
    'var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("state")[text];'
  );
  let largeImage = await mainWindow.webContents.executeJavaScript(
    'var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("limage")[text];'
  );
  let largeImageTooltip = await mainWindow.webContents.executeJavaScript(
    'var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("ltext")[text];'
  );
  let smallImage = await mainWindow.webContents.executeJavaScript(
    'var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("simage")[text];'
  );
  let smallImageTooltip = await mainWindow.webContents.executeJavaScript(
    'var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("stext")[text];'
  );

  rpc.setActivity({
    details: details,
    state: state,
    largeImageKey: largeImage,
    largeImageText: largeImageTooltip,
    smallImageKey: smallImage,
    smallImageText: smallImageTooltip,
    instance: false
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    minWidth: 400,
    height: 700,
    minHeight: 300,
    icon: __dirname + '/src/img/256x256.png',
    frame: false,
    title: 'MakeYourRPC'
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './src/index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  mainWindow.once('ready-to-show', () => {
    win.show();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('maximize');
  });
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('unmaximize');
  });
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});

rpc.on('ready', () => {
  setActivity();
  setInterval(() => {
    setActivity();
  }, 15e3);
});

async function destroyRPC() {
  if (!rpc) return;
  await rpc.destroy();
  rpc = null;
}

function initRPC(clientID) {}

ipcMain.on('stoprpc', () => {
  destroyRPC();
});

ipcMain.on('start', () => {
  rpc.login(clientId).catch(console.error);
});
