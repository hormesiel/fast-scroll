import {MDCRipple} from '@material/ripple';
import {MDCTextField} from '@material/textfield';

document.addEventListener('DOMContentLoaded', () => {
  // (page title)
  const title = document.querySelector('#title');
  title.innerHTML = chrome.i18n.getMessage('settingsTitle');


  // Scroll speed multiplier
  const scrollSpeedMultiplierTextField = new MDCTextField(document.querySelector('.mdc-text-field'));

  const scrollSpeedMultiplierLabel = document.querySelector('#scroll-multiplier-label');
  scrollSpeedMultiplierLabel.innerHTML = chrome.i18n.getMessage('settingsTextFieldLabel');



  // Key to press
  const keyToPressTextField = new MDCTextField(document.querySelectorAll('.mdc-text-field')[1]);

  const keyToPressLabel = document.querySelector('#key-to-press-label');
  keyToPressLabel.innerHTML = chrome.i18n.getMessage('settingsKeyToPressLabel');

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
  button.innerHTML = chrome.i18n.getMessage('settingsSaveButtonLabel');
  button.addEventListener('click', () => {
    chrome.storage.sync.set({
      scrollFactor: scrollSpeedMultiplierTextField.value, // No need to cast it to a Number for multiplication to work
      keyToPress: keyToPressTextField.value
    });
  });

  MDCRipple.attachTo(button);


  // (display saved/default options values)

  chrome.storage.sync.get({
    keyToPress: 'ShiftLeft',
    scrollFactor: 3,
  }, function(options) {
    scrollSpeedMultiplierTextField.value = options.scrollFactor;
    scrollSpeedMultiplierTextField.disabled = false;

    keyToPressTextField.value = options.keyToPress;
    keyToPressTextField.disabled = false;
  });
});
