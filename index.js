let scrollFaster = false;
let options;

// Get options values

chrome.storage.sync.get({
  keyToPress: 'ShiftLeft',
  scrollFactor: 3,
}, function(items) {
  options = items;
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (changes.keyToPress)
    options.keyToPress = changes.keyToPress.newValue;
  if (changes.scrollFactor)
    options.scrollFactor = changes.scrollFactor.newValue;
});

// Attach event listeners

window.addEventListener('wheel', event => {
  if (!scrollFaster)
    return;

  event.preventDefault();
  window.scrollBy(0, event.deltaY * options.scrollFactor);
});

window.addEventListener('keydown', event => {
  if (event.code == options.keyToPress) {
    event.preventDefault();
    scrollFaster = true;
  }
});

window.addEventListener('keyup', event => {
  if (event.code == options.keyToPress) {
    event.preventDefault();
    scrollFaster = false;
  }
});
