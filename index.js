let scrollFaster = false;
let options;

// Get options values

chrome.storage.sync.get({
  keyToPress: 'ShiftLeft',
  scrollFactor: 3,
  scrollSpeedMultiplier: null,
}, function(items) {
  options = items;
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (changes.keyToPress)
    options.keyToPress = changes.keyToPress.newValue;
  if (changes.scrollSpeedMultiplier)
    options.scrollSpeedMultiplier = changes.scrollSpeedMultiplier.newValue;
});

// Attach event listeners

window.addEventListener('wheel', event => {
  if (!scrollFaster)
    return;

  event.preventDefault();
  window.scrollBy(0, event.deltaY * (options.scrollSpeedMultiplier || options.scrollFactor));
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
