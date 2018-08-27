import {MDCRipple} from '@material/ripple';
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
  const keyToPressTextField = new MDCTextField(document.querySelectorAll('.mdc-text-field')[1]);

  const keyToPressLabel = document.querySelector('#key-to-press-label');
  keyToPressLabel.innerHTML = chrome.i18n.getMessage('Settings_KeyToPress_label');

  const keyToPressInput = document.querySelector('#key-to-press');
  keyToPressInput.addEventListener('keydown', (event) => {
    event.preventDefault();

    if (event.code == 'ControlLeft'
      || event.code == 'ShiftLeft'
      || event.code == 'AltLeft')
      keyToPressInput.value = event.code;
  });


  // (save button)
  const button = document.querySelector('#button');
  button.innerHTML = chrome.i18n.getMessage('Settings_Button_label');
  button.addEventListener('click', () => {
    chrome.storage.sync.set({
      scrollSpeedMultiplier: scrollSpeedMultiplierTextField.value, // No need to cast it to a Number for multiplication to work
      keyToPress: keyToPressTextField.value
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

    keyToPressTextField.value = options.keyToPress;
    keyToPressTextField.disabled = false;
  });
});
