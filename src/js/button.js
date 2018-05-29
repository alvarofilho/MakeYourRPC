const { ipcRenderer: ipc } = require('electron');

function save() {
  let btn = document.getElementById('btn-save');
  ipc.send('saverpc');
  btn.innerHTML = '<div class="spinner"></div> <a>Update</a>';
  btn.setAttribute('class', 'button button_green');
  setTimeout(() => {
    btn.setAttribute('class', 'button button_blue');
    btn.innerHTML = '<i class="far fa-edit"></i> <a>Update</a>';
  }, 1000 * 2);
}

function run() {
  let btn = document.getElementById('btn-run');

  if (btn.hasAttribute('date-run')) {
    btn.setAttribute('class', 'button button_blue');
    btn.removeAttribute('date-run');
    btn.innerHTML = '<i class="fas fa-play"></i> Ligar';
    ipc.send('stoprpc');
  } else {
    btn.setAttribute('class', 'button button_red');
    btn.setAttribute('date-run', 'run');
    btn.innerHTML = '<i class="fas fa-stop"></i> Desligar';
    ipc.send('startrpc');
  }
}
