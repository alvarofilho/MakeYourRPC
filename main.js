const { app, ipcMain: ipc, BrowserWindow, } = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('discord-rpc');
const settings = require('electron-settings');

let rpc;
let mainWindow;

const appReady = async() => {
    createWindow();
    require('./src/tray/createTray').run(mainWindow);

    mainWindow.once('ready-to-show', () => mainWindow.show());

    mainWindow.on('closed', () => (mainWindow = null));

    mainWindow.on('maximize', () => mainWindow.webContents.send('maximize'));

    mainWindow.on('unmaximize', () => mainWindow.webContents.send('unmaximize'));

    if (!settings.has('clientId')) {
        settings.set('clientId', '445351781774393345');
    }

    if (!settings.has('state')) {
        settings.set('state', {
            state: 'Estou usando o MakeYourRPC',
            details: 'https://github.com/alvarofilho/MakeYourRPC'
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
}

app.on('ready', appReady);

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

ipc.on('stoprpc', () => {
    if (!rpc) return;
    rpc.clearActivity();
    rpc.destroy();
    rpc = null;
});

ipc.on('startrpc', async() => {
    let { clientId } = await clientInfo();
    rpc = new DiscordRPC.Client({ transport: 'ipc' });
    rpc.once('ready', () => {
        setActivity();
        setTimeout(() => setActivity(), 1000);
    });
    rpc.login({ clientId }).catch(console.error);
});

ipc.on('saverpc', async() => {
    settings.clearPath();
    let { clientId, state, details, largeImage, smallImage, largeImageTooltip, smallImageTooltip } = await clientInfo();
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
});

async function setActivity() {
    if (!rpc || !mainWindow) return;

    let { details, state, largeImage, largeImageTooltip, smallImage, smallImageTooltip } = await clientInfo();

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

async function clientInfo() {
    let clientId = await mainWindow.webContents.executeJavaScript('document.getElementById("clientid")[text];');
    let details = await mainWindow.webContents.executeJavaScript('document.getElementById("details")[text];');
    let state = await mainWindow.webContents.executeJavaScript('document.getElementById("state")[text];');
    let largeImage = await mainWindow.webContents.executeJavaScript('document.getElementById("limage")[text];');
    let largeImageTooltip = await mainWindow.webContents.executeJavaScript('document.getElementById("ltext")[text];');
    let smallImage = await mainWindow.webContents.executeJavaScript('document.getElementById("simage")[text];');
    let smallImageTooltip = await mainWindow.webContents.executeJavaScript('document.getElementById("stext")[text];');
    return { clientId, state, details, largeImage, smallImage, largeImageTooltip, smallImageTooltip };
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        minWidth: 400,
        height: 700,
        minHeight: 300,
        icon: __dirname + '/src/img/256x256.png',
        frame: false,
        title: 'MakeYourRPC',
        webPreferences: {
            nodeIntegration: true,
        }
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, './src/index.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    //mainWindow.webContents.openDevTools();
}