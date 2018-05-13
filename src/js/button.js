function save() {
  let btn = document.getElementById('btn-save');
}

function run() {
  let btn = document.getElementById('btn-run');

  if (btn.hasAttribute('date-run')) {
    btn.setAttribute('class', 'button');
    btn.removeAttribute('date-run');
    btn.innerHTML = 'Ligar';
    rpc.clearActivity();
  } else {
    btn.setAttribute('class', 'button red');
    btn.setAttribute('date-run', 'run');
    btn.innerHTML = 'Desligar';
  }
}
