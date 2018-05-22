const $ = require('jquery');
const { remote } = require('electron');
var win = remote.getCurrentWindow();

$('#minimize').click(() => {
  win.minimize();
});

$('#close').click(() => {
  win.close();
});

$('#maximize').click(() => {
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});
