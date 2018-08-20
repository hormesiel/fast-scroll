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
});
