declare const chrome;

import defaultSettings from './default-settings';

let performHorizontalScroll = false;
let pressedKeys = [];
let settings;

// Get current settings and listen to changes (when saving on the 'Options' page)

chrome.storage.sync.get(defaultSettings, savedSettings => settings = savedSettings);

chrome.storage.onChanged.addListener(changes => {
  if (changes.keyToPress)
    settings.keyToPress = changes.keyToPress.newValue;
  if (changes.scrollSpeedMultiplier)
    settings.scrollSpeedMultiplier = changes.scrollSpeedMultiplier.newValue;
});

// Listen to mouse wheel events to trigger custom scroll behavior

window.addEventListener('wheel', event => {
  // If the trigger key isn't pressed, pass
  if (!pressedKeys.includes(settings.keyToPress))
    return;

  // Don't let the browser perform the scrolling
  event.preventDefault();

  /* When scrolling to the bottom or to the right, `event.deltaY` will be a positive int ;
  when scrolling to the top or to the left, it will be a negative int.
  During my tests `event.deltaX` never changed and was always `0`, but I think it's because my mouse has a
  unidirectional wheel, while some other mouses can be have a bidirectional wheel, that's why I'm checking it to support
  all possible use cases */
  const scrollAmountDefault = (event.deltaY || event.deltaX);
  const scrollAmountCustom = scrollAmountDefault * settings.scrollSpeedMultiplier;

  // Perform our custom scroll with a custom amount
  if (performHorizontalScroll)
    window.scrollBy(scrollAmountCustom, 0);
  else
    window.scrollBy(0, scrollAmountCustom);
}, {
  passive: false, // required to be able to call `event.preventDefault()`
});

// Keep a list of currently pressed keys

window.addEventListener('keydown', event => {
  if (!pressedKeys.includes(event.code))
    pressedKeys.push(event.code);

  // Perform horizontal scroll when any 'Shift' key is pressed, vertical scroll otherwise (like Chrome's default behavior)
  performHorizontalScroll = pressedKeys.includes('ShiftLeft') || pressedKeys.includes('ShiftRight');
});

window.addEventListener('keyup', event => {
  if (pressedKeys.includes(event.code)) {
    const keyIndex = pressedKeys.indexOf(event.code);
    pressedKeys.splice(keyIndex, 1);
  }

  // Perform horizontal scroll when any 'Shift' key is pressed, vertical scroll otherwise (like Chrome's default behavior)
  performHorizontalScroll = pressedKeys.includes('ShiftLeft') || pressedKeys.includes('ShiftRight');
});

// Clear all pressed keys when the page loses focus
// (by default keys stay pressed when tab-switching to another OS window)

window.addEventListener('blur', () => pressedKeys = []);

window.addEventListener('debug', () => console.log(pressedKeys));
