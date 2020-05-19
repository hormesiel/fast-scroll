import './index.scss';

declare const chrome;

//
// Types
//

enum KeyToPress {
  AltLeft = 'AltLeft',
  ControlLeft = 'ControlLeft',
  ShiftLeft = 'ShiftLeft',
}

interface Settings {
  keyToPress: KeyToPress;
  scrollFactor: number; // replaced by `scrollSpeedMultiplier`
  scrollSpeedMultiplier: number;
}

//
// Variables
//

const defaultSettings: Settings = {
  keyToPress: KeyToPress.ShiftLeft,
  scrollFactor: 3,
  scrollSpeedMultiplier: 3,
};

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
  document.querySelector('#shiftLeftOption').innerHTML = chrome.i18n.getMessage('Settings_KeyToPress_ShiftLeft');
  keyToPressSelect.addEventListener('input', () => updateSaveButtonState(saveButton, savedSettings,
    getFormValues(scrollSpeedMultiplierTextField, keyToPressSelect))
  );

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
    scrollSpeedMultiplierTextField.value = settings.scrollSpeedMultiplier || settings.scrollFactor;
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
    scrollFactor: Number(scrollSpeedMultiplierTextField.value),
    scrollSpeedMultiplier: Number(scrollSpeedMultiplierTextField.value),
  };
}

function save(settings: Settings, saveButton: HTMLButtonElement, savedSettings: Settings) {
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
