declare const chrome;

//
// Imports
//

import defaultSettings from './default-settings';
import { Settings } from './types';

//
// Variables
//

let settings: Settings;

//
// Init
//

loadSettings(() => attachListener());

//
// Helpers
//

function attachListener() {
  window.addEventListener('wheel', event => {
    if (settings.mode === Settings.Mode.OnTriggerKeyPressed)
      console.warn('TODO');
    else if (settings.mode === Settings.Mode.Always)
      console.warn('TODO');
  });
}

function loadSettings(callback: () => void) {
  // load saved settings
  chrome.storage.sync.get(defaultSettings, savedSettings => {
    settings = savedSettings;
    callback();
  });

  // listen to changes
  chrome.storage.onChanged.addListener(changes => {
    if (changes.mode)
      settings.mode = changes.mode.newValue;
    if (changes.scrollSpeedMultiplier)
      settings.scrollSpeedMultiplier = changes.scrollSpeedMultiplier.newValue;
    if (changes.triggerKey)
      settings.triggerKey = changes.triggerKey.newValue;
  });
}
