function save() {
  alert('save');
}
function run() {
  let x = document.getElementById('btn-run');

  if (x.hasAttribute('date-run')) {
    x.setAttribute('class', 'button');
    x.removeAttribute('date-run');
    x.innerHTML = 'Run';
  } else {
    x.setAttribute('class', 'button red');
    x.setAttribute('date-run', 'run');
    x.innerHTML = 'Stop';
  }
}
