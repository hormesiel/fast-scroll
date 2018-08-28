import {MDCRipple} from '@material/ripple';
import {MDCSelect} from '@material/select';
import {MDCTextField} from '@material/textfield';

document.addEventListener('DOMContentLoaded', () => {
  // (page title)
  const title = document.querySelector('#title');
  title.innerHTML = chrome.i18n.getMessage('Settings_title');


  // Scroll speed multiplier
  const scrollSpeedMultiplierTextField = new MDCTextField(document.querySelector('.mdc-text-field'));

  const scrollSpeedMultiplierLabel = document.querySelector('#scroll-speed-multiplier-label');
  scrollSpeedMultiplierLabel.innerHTML = chrome.i18n.getMessage('Settings_ScrollSpeedMultiplier_label');



  // Key to press
  const keyToPressSelect = new MDCSelect(document.querySelector('.mdc-select'));

  const keyToPressLabel = document.querySelector('#key-to-press-label');
  keyToPressLabel.innerHTML = chrome.i18n.getMessage('Settings_KeyToPress_label');


  // (save button)
  const button = document.querySelector('#button');
  button.innerHTML = chrome.i18n.getMessage('Settings_Button_label');
  button.addEventListener('click', () => {
    chrome.storage.sync.set({
      scrollSpeedMultiplier: scrollSpeedMultiplierTextField.value, // No need to cast it to a Number for multiplication to work
      keyToPress: keyToPressSelect.value
    });
  });

  MDCRipple.attachTo(button);


  // (display saved/default options values)

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
