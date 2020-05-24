declare const chrome;

//
// Imports
//

import defaultSettings from './../default-settings';
import { Settings, Settings_Mode, Settings_TriggerKey } from './../types';
import './index.scss';

//
// Variables
//

const i18n = chrome.i18n;

let mode: HTMLSelectElement;
let modeDescription: HTMLParagraphElement;
let modeWarning: HTMLParagraphElement;
let saveButton: HTMLButtonElement;
let scrollSpeedMultiplier: HTMLInputElement;
let triggerKey: HTMLSelectElement;
let triggerKeyWarning: HTMLParagraphElement;

let currentSettings: Settings; // to enable / disable the 'Save' button based on form changes

//
// Init
//

document.addEventListener('DOMContentLoaded', () => {
  queryElements();
  loadLocalizedStrings();
  loadCurrentSettings();
  attachFormListeners();
});

//
// Helpers
//

function attachFormListeners() {
  document.addEventListener('input', () => updateSaveButtonState());

  mode.addEventListener('input', () => {
    updateModeDescription(Settings.Mode[mode.value]);
    updateModeWarning(Settings.Mode[mode.value]);
  });
  triggerKey.addEventListener('input', () => updateTriggerKeyWarning(Settings.TriggerKey[triggerKey.value]));

  saveButton.addEventListener('click', save);
}

function formValuesHaveChanged(): boolean {
  const formValues = getFormValues();

  const modeChanged = formValues.mode !== currentSettings.mode;
  const scrollSpeedMultiplierChanged = formValues.scrollSpeedMultiplier !== currentSettings.scrollSpeedMultiplier;
  const triggerKeyChanged = formValues.triggerKey !== currentSettings.triggerKey;

  return modeChanged || scrollSpeedMultiplierChanged || triggerKeyChanged;
}

function getFormValues(): Settings {
  return {
    mode: Settings.Mode[mode.value],
    scrollSpeedMultiplier: Number(scrollSpeedMultiplier.value),
    triggerKey: Settings.TriggerKey[triggerKey.value],
  };
}

function loadLocalizedStrings() {
  // title
  const title = document.getElementById('title');
  title.innerHTML = i18n.getMessage('Settings_title');

  // scroll speeed multiplier
  const scrollSpeedMultiplierLabel = document.getElementById('scrollSpeedMultiplierLabel');
  scrollSpeedMultiplierLabel.innerHTML = i18n.getMessage('Settings_ScrollSpeedMultiplier_label');

  // mode
  const modeLabel = document.getElementById('modeLabel');
  modeLabel.innerHTML = i18n.getMessage('Settings_Mode_label');

  const modeOnTriggerKeyPressed = document.getElementById('modeOnTriggerKeyPressed');
  modeOnTriggerKeyPressed.innerHTML = i18n.getMessage('Settings_Mode_OnTriggerKeyPressed_label');
  const modeAlways = document.getElementById('modeAlways');
  modeAlways.innerHTML = i18n.getMessage('Settings_Mode_Always_label');

  modeWarning.innerHTML = i18n.getMessage('Settings_Mode_Always_warning');

  // trigger key
  const triggerKeyLabel = document.getElementById('triggerKeyLabel');
  triggerKeyLabel.innerHTML = i18n.getMessage('Settings_TriggerKey_label');

  const triggerKeyAltLeftOptionLabel = document.getElementById('triggerKeyAltLeftOptionLabel');
  triggerKeyAltLeftOptionLabel.innerHTML = i18n.getMessage('Settings_TriggerKey_AltLeft');
  const triggerKeyControlLeftOptionLabel = document.getElementById('triggerKeyControlLeftOptionLabel');
  triggerKeyControlLeftOptionLabel.innerHTML = i18n.getMessage('Settings_TriggerKey_ControlLeft');

  triggerKeyWarning.innerHTML = i18n.getMessage('Settings_TriggerKey_ControlLeft_warning');

  // save button
  saveButton.innerHTML = i18n.getMessage('Settings_SaveButton_label');
}

function loadCurrentSettings() {
  chrome.storage.sync.get(defaultSettings, settings => {
    setFormValues(settings);
    setFormEnabled(true);

    currentSettings = settings;
    // cast `scrollSpeedMultiplier` to a Number since v2 stored a String
    currentSettings.scrollSpeedMultiplier = Number(currentSettings.scrollSpeedMultiplier);
  });
}

function queryElements() {
  mode = document.getElementById('mode') as HTMLSelectElement;
  modeDescription = document.getElementById('modeDescription') as HTMLParagraphElement;
  modeWarning = document.getElementById('modeWarning') as HTMLParagraphElement;
  saveButton = document.getElementById('saveButton') as HTMLButtonElement;
  scrollSpeedMultiplier = document.getElementById('scrollSpeedMultiplier') as HTMLInputElement;
  triggerKey = document.getElementById('triggerKey') as HTMLSelectElement;
  triggerKeyWarning = document.getElementById('triggerKeyWarning') as HTMLParagraphElement;
}

function save() {
  const formValues = getFormValues();

  chrome.storage.sync.set(formValues, () => {
    saveButton.disabled = true;
    currentSettings = formValues;
  });
}

function setFormEnabled(enabled: boolean) {
  const disabled = !enabled;

  mode.disabled = disabled;
  scrollSpeedMultiplier.disabled = disabled;
  triggerKey.disabled = disabled;
}

function setFormValues(settings: Settings) {
  mode.value = settings.mode;
  scrollSpeedMultiplier.value = settings.scrollSpeedMultiplier.toString();
  triggerKey.value = settings.triggerKey;

  updateModeDescription(settings.mode);
  updateModeWarning(settings.mode);
  updateTriggerKeyWarning(settings.triggerKey);
}

function updateModeDescription(mode: Settings_Mode) {
  modeDescription.innerHTML = i18n.getMessage(`Settings_Mode_${mode}_description`);
}

function updateModeWarning(mode: Settings_Mode) {
  modeWarning.classList.toggle('is-visible', mode === Settings.Mode.Always);
}

function updateSaveButtonState() {
  saveButton.disabled = !formValuesHaveChanged();
}

function updateTriggerKeyWarning(mode: Settings_TriggerKey) {
  triggerKeyWarning.classList.toggle('is-visible', mode === Settings.TriggerKey.ControlLeft);
}
