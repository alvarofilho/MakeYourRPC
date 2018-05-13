const config = require('./config.json');

var text = 'textContent' in document.body ? 'textContent' : 'innerText';
document.getElementById('details')[text] = config.state.details;
document.getElementById('state')[text] = config.state.state;
document.getElementById('simage')[text] = config.images.smallImage;
document.getElementById('limage')[text] = config.images.largeImage;
document.getElementById('stext')[text] = config.images.smallImageTooltip;
document.getElementById('ltext')[text] = config.images.largeImageTooltip;
