import './index.scss';

//
// Main function
//

document.addEventListener('DOMContentLoaded', () => {
  // Page title

  const title = document.querySelector('#title');
  title.innerHTML = chrome.i18n.getMessage('Settings_title');

  // Scroll speed multiplier

  const scrollSpeedMultiplierTextField = document.querySelector('#scrollSpeedMultiplier');
  const scrollSpeedMultiplierLabel = document.querySelector('#scrollSpeedMultiplierLabel');
  scrollSpeedMultiplierLabel.innerHTML = chrome.i18n.getMessage('Settings_ScrollSpeedMultiplier_label');

  // Key to press

  const keyToPressSelect = document.querySelector('#keyToPress');
  const keyToPressLabel = document.querySelector('#keyToPressLabel');
  keyToPressLabel.innerHTML = chrome.i18n.getMessage('Settings_KeyToPress_label');

  document.querySelector('#altLeftOption').innerHTML = chrome.i18n.getMessage('Settings_KeyToPress_AltLeft');
  document.querySelector('#controlLeftOption').innerHTML = chrome.i18n.getMessage('Settings_KeyToPress_ControlLeft');
  document.querySelector('#shiftLeftOption').innerHTML = chrome.i18n.getMessage('Settings_KeyToPress_ShiftLeft');

  // Save button

  const button = document.querySelector('#button');
  button.innerHTML = chrome.i18n.getMessage('Settings_Button_label');
  button.addEventListener('click', () => {
    chrome.storage.sync.set({
      scrollSpeedMultiplier: scrollSpeedMultiplierTextField.value, // No need to cast it to a Number for multiplication to work
      keyToPress: keyToPressSelect.value
    });
  });

  // Populate form with saved / default values

  chrome.storage.sync.get({
    keyToPress: 'ShiftLeft',
    scrollFactor: 3,
    scrollSpeedMultiplier: null,
  }, function(options) {
    scrollSpeedMultiplierTextField.value = options.scrollSpeedMultiplier || options.scrollFactor;
    scrollSpeedMultiplierTextField.disabled = false;

    keyToPressSelect.value = options.keyToPress;
  });
});
