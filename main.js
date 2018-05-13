const electron = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('discord-rpc');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const config = require('./src/config.json');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    minWidth: 400,
    height: 600,
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
  mainWindow.webContents.openDevTools();

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

let clientId = config.clientId;

DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

async function setActivity() {
  if (!rpc || !mainWindow) return;

  rpc.setActivity({
    details: config.state.details,
    state: config.state.state,
    largeImageKey: config.images.largeImage,
    largeImageText: config.images.largeImageTooltip,
    smallImageKey: config.images.smallImage,
    smallImageText: config.images.smallImageTooltip,
    instance: false
  });
}

rpc.on('ready', () => {
  setActivity();
  setInterval(() => {
    setActivity();
  }, 1000);
});

rpc.login(clientId).catch(console.error);
