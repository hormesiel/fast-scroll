import {MDCRipple} from '@material/ripple';
import {MDCTextField} from '@material/textfield';

document.addEventListener('DOMContentLoaded', () => {
  const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));
  const textfieldScrollMultiplier = new MDCTextField(document.querySelector('.mdc-text-field'));
  const textfieldTriggerKey = new MDCTextField(document.querySelectorAll('.mdc-text-field')[1]);

  chrome.storage.sync.get({
    scrollFactor: 3,
    keyToPress: 'ShiftLeft',
  }, function(items) {
    textfieldScrollMultiplier.value = items.scrollFactor;
    textfieldScrollMultiplier.disabled = false;

    textfieldTriggerKey.value = items.keyToPress;
    textfieldTriggerKey.disabled = false;
  });

  document.querySelector('.mdc-button').addEventListener('click', () => {
    chrome.storage.sync.set({
      scrollFactor: textfieldScrollMultiplier.value, // No need to cast it to a Number for multiplication to work
      keyToPress: textfieldTriggerKey.value
    });
  });

  const title = document.querySelector('#title');
  const textfieldScrollMultiplierLabel = document.querySelector('#scroll-multiplier-label');
  const button = document.querySelector('#button');

  title.innerHTML = chrome.i18n.getMessage('settingsTitle');
  textfieldScrollMultiplierLabel.innerHTML = chrome.i18n.getMessage('settingsTextFieldLabel');
  button.innerHTML = chrome.i18n.getMessage('settingsSaveButtonLabel');

  const triggerKeyInput = document.querySelector('#key-to-press');
  triggerKeyInput.addEventListener('keydown', (event) => {
    event.preventDefault();

    if (event.code == 'ControlLeft'
      || event.code == 'ShiftLeft'
      || event.code == 'AltLeft')
      triggerKeyInput.value = event.code;
  });
});
