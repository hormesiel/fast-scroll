declare const chrome;

import defaultSettings from '../default-settings';
import {KeyToPress, Settings} from '../types';
import './index.scss';

//
// Main function
//

document.addEventListener('DOMContentLoaded', () => {
  // Page title

  const title = document.querySelector('#title');
  title.innerHTML = chrome.i18n.getMessage('Settings_title');

  // Scroll speed multiplier

  const scrollSpeedMultiplierTextField = document.querySelector('#scrollSpeedMultiplier') as HTMLInputElement;
  const scrollSpeedMultiplierLabel = document.querySelector('#scrollSpeedMultiplierLabel');
  scrollSpeedMultiplierLabel.innerHTML = chrome.i18n.getMessage('Settings_ScrollSpeedMultiplier_label');

  scrollSpeedMultiplierTextField.addEventListener('input', () => updateSaveButtonState(saveButton, savedSettings,
    getFormValues(scrollSpeedMultiplierTextField, keyToPressSelect))
  );

  // Key to press

  const keyToPressSelect = document.querySelector('#keyToPress') as HTMLSelectElement;
  const keyToPressLabel = document.querySelector('#keyToPressLabel');
  keyToPressLabel.innerHTML = chrome.i18n.getMessage('Settings_KeyToPress_label');

  document.querySelector('#altLeftOption').innerHTML = chrome.i18n.getMessage('Settings_KeyToPress_AltLeft');
  document.querySelector('#controlLeftOption').innerHTML = chrome.i18n.getMessage('Settings_KeyToPress_ControlLeft');
  keyToPressSelect.addEventListener('input', () => {
    const formValues = getFormValues(scrollSpeedMultiplierTextField, keyToPressSelect);
    updateSaveButtonState(saveButton, savedSettings, formValues);
  });

  // Save button

  const saveButton = document.querySelector('#button') as HTMLButtonElement;
  saveButton.innerHTML = chrome.i18n.getMessage('Settings_Button_label');
  saveButton.addEventListener('click', () => {
    const formValues = getFormValues(scrollSpeedMultiplierTextField, keyToPressSelect);
    save(formValues, saveButton, savedSettings);
  });

  const savedSettings = Object.assign({}, defaultSettings); // set to defaults to avoid TypeScript compile error

  // Populate form with saved / default values

  chrome.storage.sync.get(defaultSettings, function(settings) {
    scrollSpeedMultiplierTextField.value = settings.scrollSpeedMultiplier;
    scrollSpeedMultiplierTextField.disabled = false;
    keyToPressSelect.value = settings.keyToPress;

    // Keep a reference to current settings to enable / disable the 'Save' button based on form changes
    Object.assign(savedSettings, settings);
    // Cast `scrollSpeedMultiplier` to a Number since previous versions stored a String
    savedSettings.scrollSpeedMultiplier = Number(savedSettings.scrollSpeedMultiplier);
  });
});

//
// Helpers
//

function getFormValues(scrollSpeedMultiplierTextField: HTMLInputElement, keyToPressSelect: HTMLSelectElement): Settings {
  return {
    keyToPress: KeyToPress[keyToPressSelect.value],
    scrollSpeedMultiplier: Number(scrollSpeedMultiplierTextField.value),
  };
}

function save(settings: Settings, saveButton: HTMLButtonElement, savedSettings: Settings) {
  /* If a user has v2 of the extension with 'ShiftLeft' as trigger key, and if he updates the extensions, comes to this
  page, changes the Scroll speed multiplier but *doesn't change the trigger key*, when he saves the `keyToPress` will be
  `undefined` since the <select>'s selected option won't be a valid option, thus `KeyToPress[selectedOption]` will return
  `undefined`. In this case, we auto-set the AltLeft as trigger key to force the user to stop using ShiftLeft, since it
  clashes with Chrome's default scrolling behavior. */
  if (settings.keyToPress === undefined)
    settings.keyToPress = KeyToPress.AltLeft;

  chrome.storage.sync.set(settings, () => {
    saveButton.disabled = true;
    Object.assign(savedSettings, settings); // update local reference to saved settings
  });
}

function updateSaveButtonState(saveButton: HTMLButtonElement, savedSettings: Settings, formValues: Settings) {
  const keyToPressHasBeenModified = formValues.keyToPress !== savedSettings.keyToPress;
  const scrollSpeedMultiplierHasBeenModified = formValues.scrollSpeedMultiplier !== savedSettings.scrollSpeedMultiplier;

  const formHasBeenModified = keyToPressHasBeenModified || scrollSpeedMultiplierHasBeenModified;
  saveButton.disabled = !formHasBeenModified;
}
