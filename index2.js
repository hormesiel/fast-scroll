let scrollFaster = false;

window.addEventListener('wheel', event => {
  if (!scrollFaster)
    return;

  event.preventDefault();
  window.scrollBy(0, event.deltaY * 3);
});

window.addEventListener('keydown', event => {
  if (event.code == 'ShiftLeft')
    scrollFaster = true;
});

window.addEventListener('keyup', event => {
  if (event.code == 'ShiftLeft')
    scrollFaster = false;
});
