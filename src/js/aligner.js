function align(c) {
  let element = document.getElementById(c).parentElement;
  let height = element.offsetHeight;
  let variable = height;
  document.getElementById(c).style.lineHeight = variable + 'px';
}

window.onload = () => {
  align('togglers');
};

window.addEventListener(
  'resize',
  () => {
    align('togglers');
  },
  false
);
