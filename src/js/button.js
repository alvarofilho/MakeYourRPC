const { ipcRenderer } = require('electron');

function save() {
  let btn = document.getElementById('btn-save');
  ipcRenderer.send('saverpc', 'save');
}

function run() {
  let btn = document.getElementById('btn-run');

  if (btn.hasAttribute('date-run')) {
    btn.setAttribute('class', 'button');
    btn.removeAttribute('date-run');
    btn.innerHTML = '<i class="fas fa-play"></i> Ligar';
    ipcRenderer.send('stoprpc', 'stop');
  } else {
    btn.setAttribute('class', 'button red');
    btn.setAttribute('date-run', 'run');
    btn.innerHTML = '<i class="fas fa-stop"></i> Desligar';
    ipcRenderer.send('startrpc', 'start');
  }
}
