var scrollFactor;

chrome.storage.sync.get({
  scrollFactor: 3
}, function(items) {
  scrollFactor = items.scrollFactor;
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  scrollFactor = changes.scrollFactor.newValue;
});

window.addEventListener('wheel', function(e) {
  e.preventDefault();

   // Horizontal scroll
  if (e.shiftKey) {
    if (e.ctrlKey)
      document.body.scrollLeft += e.deltaX * scrollFactor;
    else
      document.body.scrollLeft += e.deltaX;
  }
  // Verical scroll
  else {
    if (e.ctrlKey)
      document.body.scrollTop += e.deltaY * scrollFactor;
    else
      document.body.scrollTop += e.deltaY;
  }
}, false);
