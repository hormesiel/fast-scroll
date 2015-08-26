var scrollFactor;

if (document.body.offsetHeight <= window.innerHeight) { // maybe web app with unscrollable body and overflow content
  throw new Error("Fast Scroll Error: Web app detected. The extension won't work on this website.");
}

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
}, false);
