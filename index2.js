let scrollFaster = false;
let scrollFactor = 1;

// Get scroll multiplier value

chrome.storage.sync.get({
  scrollFactor: 3
}, function(items) {
  scrollFactor = items.scrollFactor;
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  scrollFactor = changes.scrollFactor.newValue;
});

// Attach event listeners

window.addEventListener('wheel', event => {
  if (!scrollFaster)
    return;

  event.preventDefault();
  window.scrollBy(0, event.deltaY * scrollFactor);
});

window.addEventListener('keydown', event => {
  if (event.code == 'ShiftLeft')
    scrollFaster = true;
});

window.addEventListener('keyup', event => {
  if (event.code == 'ShiftLeft')
    scrollFaster = false;
});
