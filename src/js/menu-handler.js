const $ = require('jquery');
const { remote } = require('electron');
var win = remote.getCurrentWindow();

$('#minimize').click(() => win.hide());

$('#close').click(() => win.close());
