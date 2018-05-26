const {
  app,
  ipcMain,
  Tray,
  Menu,
  BrowserWindow,
  Notification
} = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('./RPC');
const settings = require('electron-settings');

let rpc;
let clientId;
let tray;
let mainWindow;

app.on('ready', () => {
  createTray();
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

  if (!settings.has('clientId')) {
    settings.set('clientId', '445351781774393345');
  }

  if (!settings.has('state')) {
    settings.set('state', {
      state: 'Estou usando o MakeYourRPC',
      details: 'https://github.com/SrSheep/MakeYourRPC'
    });
  }

  if (!settings.has('images')) {
    settings.set('images', {
      largeImage: 'fundo',
      smallImage: 'lua',
      largeImageTooltip: 'MakeYourRPC',
      smallImageTooltip: 'MakeYourRPC'
    });
  }

  clientId = settings.get('clientId');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('stoprpc', () => {
  destroyRPC();
});

ipcMain.on('startrpc', () => {
  initRPC(clientId);
});

ipcMain.on('saverpc', async () => {
  settings.clearPath();
  let clientId = await mainWindow.webContents.executeJavaScript(
    'var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("clientid")[text];'
  );
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
  settings.set('clientId', clientId);
  settings.set('state', {
    state: state,
    details: details
  });
  settings.set('images', {
    largeImage: largeImage,
    smallImage: smallImage,
    largeImageTooltip: largeImageTooltip,
    smallImageTooltip: smallImageTooltip
  });
  notifyMe();
});

function initRPC(id) {
  rpc = new DiscordRPC.Client({ transport: 'ipc' });
  rpc.once('ready', () => {
    setActivity();
    setTimeout(() => {
      setActivity();
    }, 1000);
  });
  rpc.login(id).catch(console.error);
}

function destroyRPC() {
  if (!rpc) return;
  rpc.clearActivity();
  rpc.destroy();
  rpc = null;
}

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
    width: 600,
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

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, './src/img/256x256.png'));
  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'MakeYourRPC',
      enabled: false
    },
    {
      label: 'Abrir',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Fechar',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.on('double-click', () => {
    mainWindow.show();
  });

  tray.setToolTip('MakeYourRPC');
  tray.setContextMenu(trayMenu);
}

function notifyMe() {
  let myNotification = new Notification('Título', {
    body: 'Lorem Ipsum Dolor Sit Amet'
  });

  myNotification.onclick = () => {
    console.log('Notificação clicada');
  };
}
