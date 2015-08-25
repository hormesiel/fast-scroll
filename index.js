window.addEventListener('wheel', function(e) {
  e.preventDefault();

  var scrollFactor;

  if (e.ctrlKey)
    scrollFactor = 3;
  else
    scrollFactor = 1;

  if (e.shiftKey) // Horizontal scroll
    document.body.scrollLeft += e.deltaX * scrollFactor;
  else // Verical scroll
    document.body.scrollTop += e.deltaY * scrollFactor;
}, false);