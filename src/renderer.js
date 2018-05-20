const settings = require('electron-settings');

var text = 'textContent' in document.body ? 'textContent' : 'innerText';
document.getElementById('clientid')[text] = settings.get('clientId');
document.getElementById('details')[text] = settings.get('state.details');
document.getElementById('state')[text] = settings.get('state.state');
document.getElementById('simage')[text] = settings.get('images.smallImage');
document.getElementById('limage')[text] = settings.get('images.largeImage');
document.getElementById('stext')[text] = settings.get(
  'images.largeImageTooltip'
);
document.getElementById('ltext')[text] = settings.get(
  'images.smallImageTooltip'
);
