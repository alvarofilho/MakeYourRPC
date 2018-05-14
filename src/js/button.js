function save() {
  let btn = document.getElementById('btn-save');
}

function run() {
  var xhttp = new XMLHttpRequest();
  let btn = document.getElementById('btn-run');

  if (btn.hasAttribute('date-run')) {
    btn.setAttribute('class', 'button');
    btn.removeAttribute('date-run');
    btn.innerHTML = 'Ligar';
    xhttp.open('POST', 'http://127.0.0.1:3000/stoprpc', true);
    xhttp.send('stop');
  } else {
    btn.setAttribute('class', 'button red');
    btn.setAttribute('date-run', 'run');
    btn.innerHTML = 'Desligar';
    xhttp.open('POST', 'http://127.0.0.1:3000/startrpc', true);
    xhttp.send('start');
  }
}
