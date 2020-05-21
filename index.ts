declare const chrome;

import defaultSettings from './default-settings';

let fastScrollEnabled = false;
let settings;

// Get settings values

chrome.storage.sync.get(defaultSettings, items => settings = items);

chrome.storage.onChanged.addListener(changes => {
  if (changes.keyToPress)
    settings.keyToPress = changes.keyToPress.newValue;
  if (changes.scrollSpeedMultiplier)
    settings.scrollSpeedMultiplier = changes.scrollSpeedMultiplier.newValue;
});

// Attach event listeners

window.addEventListener('wheel', event => {
  if (!fastScrollEnabled)
    return;

  event.preventDefault();
  window.scrollBy(0, event.deltaY * settings.scrollSpeedMultiplier);
});

window.addEventListener('keydown', event => {
  if (event.code == settings.keyToPress) {
    event.preventDefault();
    fastScrollEnabled = true;
  }
});

window.addEventListener('keyup', event => {
  if (event.code == settings.keyToPress) {
    event.preventDefault();
    fastScrollEnabled = false;
  }
});
