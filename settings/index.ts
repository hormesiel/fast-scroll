declare const chrome;

import defaultSettings from '../default-settings';
import {KeyToPress, Settings} from '../types';
import './index.scss';

//
// Variables
//

// Set savedSettings to a non-empty object because otherwise TypeScript complains about missing props from 'Settings' type
const savedSettings: Settings = Object.assign({}, defaultSettings);

let invertBehaviorCheckbox: HTMLInputElement;
let keyToPressSelect: HTMLSelectElement;
let saveButton: HTMLButtonElement;
let scrollSpeedMultiplierTextField: HTMLInputElement;

//
// Page init functions
//

document.addEventListener('DOMContentLoaded', () => {
  invertBehaviorCheckbox = document.querySelector('#invertBehaviorCheckbox') as HTMLInputElement;
  keyToPressSelect = document.querySelector('#keyToPress') as HTMLSelectElement;
  saveButton = document.querySelector('#button') as HTMLButtonElement;
  scrollSpeedMultiplierTextField = document.querySelector('#scrollSpeedMultiplier') as HTMLInputElement;

  loadLocalizedStrings();
  populateFormWithSavedOrDefaultSettings();
  setUpFormListeners();
});

function loadLocalizedStrings() {
  const title = document.querySelector('#title');
  title.innerHTML = chrome.i18n.getMessage('Settings_title');

  const scrollSpeedMultiplierLabel = document.querySelector('#scrollSpeedMultiplierLabel');
  scrollSpeedMultiplierLabel.innerHTML = chrome.i18n.getMessage('Settings_ScrollSpeedMultiplier_label');

  const keyToPressLabel = document.querySelector('#keyToPressLabel');
  keyToPressLabel.innerHTML = chrome.i18n.getMessage('Settings_KeyToPress_label');
  document.querySelector('#altLeftOption').innerHTML = chrome.i18n.getMessage('Settings_KeyToPress_AltLeft');
  document.querySelector('#controlLeftOption').innerHTML = chrome.i18n.getMessage('Settings_KeyToPress_ControlLeft');

  const invertBehaviorLabel = document.querySelector('#invertBehaviorLabel');
  invertBehaviorLabel.innerHTML = '<b>' + chrome.i18n.getMessage('Settings_InvertBehavior_label') + '</b> : '
    + chrome.i18n.getMessage('Settings_InvertBehavior_description');

  const saveButton = document.querySelector('#button') as HTMLButtonElement;
  saveButton.innerHTML = chrome.i18n.getMessage('Settings_Button_label');
}

function populateFormWithSavedOrDefaultSettings() {
  chrome.storage.sync.get(defaultSettings, settings => {
    invertBehaviorCheckbox.checked = settings.invertBehavior;
    keyToPressSelect.value = settings.keyToPress;
    scrollSpeedMultiplierTextField.value = settings.scrollSpeedMultiplier;
    scrollSpeedMultiplierTextField.disabled = false;

    // Keep a reference to current settings to enable / disable the 'Save' button based on form changes
    Object.assign(savedSettings, settings);
    // Cast `scrollSpeedMultiplier` to a Number since previous extension's versions stored a String
    savedSettings.scrollSpeedMultiplier = Number(savedSettings.scrollSpeedMultiplier);
  });
}

function setUpFormListeners() {
  const onAnyFormElementChanged = () => saveButton.disabled = !formValuesHaveChanged();

  invertBehaviorCheckbox.addEventListener('input', onAnyFormElementChanged);
  keyToPressSelect.addEventListener('input', onAnyFormElementChanged);
  scrollSpeedMultiplierTextField.addEventListener('input', onAnyFormElementChanged);

  saveButton.addEventListener('click', () => save());
}

//
// Helper functions
//

function formValuesHaveChanged(): boolean {
  const formValues = getFormValues();

  const invertBehaviorChanged = formValues.invertBehavior !== savedSettings.invertBehavior;
  const keyToPressChanged = formValues.keyToPress !== savedSettings.keyToPress;
  const scrollSpeedMultiplierChanged = formValues.scrollSpeedMultiplier !== savedSettings.scrollSpeedMultiplier;

  return invertBehaviorChanged || keyToPressChanged || scrollSpeedMultiplierChanged;
}

function getFormValues(): Settings {
  return {
    keyToPress: KeyToPress[keyToPressSelect.value],
    invertBehavior: invertBehaviorCheckbox.checked,
    scrollSpeedMultiplier: Number(scrollSpeedMultiplierTextField.value),
  };
}

function save() {
  const formValues = getFormValues();

  /* If a user has v2 of the extension with 'ShiftLeft' as trigger key, and if he updates the extensions, comes to this
  page, changes the Scroll speed multiplier but *doesn't change the trigger key*, when he saves the `keyToPress` will be
  `undefined` since the <select>'s selected option won't be a valid option, thus `KeyToPress[selectedOption]` will return
  `undefined`. In this case, we auto-set the AltLeft as trigger key to force the user to stop using ShiftLeft, since it
  clashes with Chrome's default scrolling behavior. */
  if (formValues.keyToPress === undefined)
    formValues.keyToPress = KeyToPress.AltLeft;

  chrome.storage.sync.set(formValues, () => {
    saveButton.disabled = true;
    Object.assign(savedSettings, formValues); // update local reference to saved settings
  });
}
