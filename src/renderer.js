const { app, webFrame } = require('electron');
const { remote } = require('electron');
const mainProcess = remote.require('./main.js');

function sair() {
  app.quit();
}
