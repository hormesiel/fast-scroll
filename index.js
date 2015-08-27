var compatible;
var loaded = false;
var scrollFactor;

function isWebsiteCompatible() {
  var compatible;

  window.scrollBy(0, 1);
  compatible = (window.scrollY === 1);
  window.scrollBy(0, -1);

  return compatible;
}

function loadSettings() {
  chrome.storage.sync.get({
    scrollFactor: 3
  }, function(items) {
    scrollFactor = items.scrollFactor;
  });

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    scrollFactor = changes.scrollFactor.newValue;
  });
}

function onPageLoaded() {
  compatible = compatible || isWebsiteCompatible();

  if (compatible && !loaded) {
    loaded = true;
    loadSettings();
    window.addEventListener('wheel', onWheelEvent, false);
  }
}

function onWheelEvent(e) {
  if (!compatible)
    return;

  e.preventDefault();

   // Horizontal scroll
  if (e.shiftKey) {
    if (e.ctrlKey)
      window.scrollBy(e.deltaX * scrollFactor, 0);
    else
      window.scrollBy(e.deltaX, 0);
  }
  // Verical scroll
  else {
    if (e.ctrlKey)
      window.scrollBy(0, e.deltaY * scrollFactor);
    else
      window.scrollBy(0, e.deltaY);
  }
}

window.addEventListener('load', onPageLoaded);
