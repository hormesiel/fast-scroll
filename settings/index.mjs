import {MDCRipple} from '@material/ripple';
import {MDCTextField} from '@material/textfield';

document.addEventListener('DOMContentLoaded', () => {
  const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));
  const textField = new MDCTextField(document.querySelector('.mdc-text-field'));

  chrome.storage.sync.get({
    scrollFactor: 3
  }, function(items) {
    textField.value = items.scrollFactor;
    textField.disabled = false;
  });

  document.querySelector('.mdc-button').addEventListener('click', () => {
    chrome.storage.sync.set({
      scrollFactor: textField.value // No need to cast it to a Number for multiplication to work
    });
  });

  const title = document.querySelector('#title');
  const textfieldLabel = document.querySelector('#label');
  const button = document.querySelector('#button');

  title.innerHTML = chrome.i18n.getMessage('settingsTitle');
  textfieldLabel.innerHTML = chrome.i18n.getMessage('settingsTextFieldLabel');
  button.innerHTML = chrome.i18n.getMessage('settingsSaveButtonLabel');
});
