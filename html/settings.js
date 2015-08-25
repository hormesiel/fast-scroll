var settings = null;
var form = null;

function onFormSubmit(e) {
  e.preventDefault();

  saveOptions();
  form.submitButton.disabled = true;
}

function onPageLoaded() {

  form = document.querySelector('form');

  form.scrollFactor = form.querySelector('#scrollFactor');
  form.submitButton = form.querySelector('button[type=submit]');

  form.addEventListener('keyup', function() {
    form.submitButton.disabled =
      (form.scrollFactor.value == settings.scrollFactor)
      || form.scrollFactor.parentNode.classList.contains('is-invalid');
  });
  form.addEventListener('submit', onFormSubmit);

  restoreOptions();
}

function restoreOptions() {
  chrome.storage.sync.get({
    scrollFactor: 3
  }, function(items) {
    settings = items;

    form.scrollFactor.value = settings.scrollFactor;

    form.scrollFactor.parentNode.classList.add('is-dirty');
  });
}

function saveOptions() {
  chrome.storage.sync.set({
    scrollFactor: form.scrollFactor.value
  });

  settings.scrollFactor = form.scrollFactor.value;
}

document.addEventListener('DOMContentLoaded', onPageLoaded);
