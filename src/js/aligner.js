function align(c) {
  var element = document.getElementById(c).parentElement,
    height = element.offsetHeight;
  var variable = parseInt(height);
  document.getElementById(c).style.lineHeight = variable + 'px';
}

window.onload = function() {
  align('togglers');
};

window.addEventListener(
  'resize',
  function() {
    align('togglers');
  },
  false
);
