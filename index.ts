declare const chrome;

import defaultSettings from './default-settings';
import {arrayIncludesAnyItemOf} from './index-helpers';
import {Settings} from './types';

let performHorizontalScroll = false;
let pressedKeys = [];
const protectedKeys = ['ControlLeft'];
let settings: Settings;

//
// Script load functions
//

init();

function init() {
  // load saved settings
  chrome.storage.sync.get(defaultSettings, savedSettings => {
    settings = savedSettings;
    console.log('settings', savedSettings);
    addEventListeners();
  });

  // listen to changes
  chrome.storage.onChanged.addListener(changes => {
    if (changes.keyToPress)
      settings.keyToPress = changes.keyToPress.newValue;
    if (changes.invertBehavior)
      settings.invertBehavior = changes.invertBehavior.newValue;
    if (changes.scrollSpeedMultiplier)
      settings.scrollSpeedMultiplier = changes.scrollSpeedMultiplier.newValue;
  });
}

// Listen to mouse wheel events to trigger custom scroll behavior

function addEventListeners() {
  // Capture scroll events before the browser

  window.addEventListener('wheel', (event: WheelEvent) => {
    const triggerKeyPressed = pressedKeys.includes(settings.keyToPress);
    console.log('triggerKeyPressed', triggerKeyPressed);

    // normal behavior : requires trigger key to be pressed
    if (!settings.invertBehavior && triggerKeyPressed)
      handleScroll(event);
    // inverted behavior : requires trigger key NOT to be pressed
    else if (settings.invertBehavior && !triggerKeyPressed)
      if (!arrayIncludesAnyItemOf(pressedKeys, protectedKeys)) // also requires some keys not to be pressed (to preserve default behaviors like Zooming in/out with ControlLeft)
        handleScroll(event);
  }, {
    passive: false, // required to be able to call `event.preventDefault()` without errors
  });

  // Keep a list of currently pressed keys

  window.addEventListener('keydown', event => {
    if (!pressedKeys.includes(event.code))
      pressedKeys.push(event.code);
    performHorizontalScroll = pressedKeys.includes('ShiftLeft') || pressedKeys.includes('ShiftRight');
  });
  window.addEventListener('keyup', event => {
    if (pressedKeys.includes(event.code)) {
      const keyIndex = pressedKeys.indexOf(event.code);
      pressedKeys.splice(keyIndex, 1);
    }
    performHorizontalScroll = pressedKeys.includes('ShiftLeft') || pressedKeys.includes('ShiftRight');
  });

  // Clear all pressed keys when the page loses focus (by default keys stay pressed when tab-switching to another OS window)

  window.addEventListener('blur', () => pressedKeys = []);
}

//
// Helper functions
//

// function handleScroll(event: WheelEvent, preventDefault: boolean) {
function handleScroll(event: WheelEvent) {
  // if (preventDefault)
    event.preventDefault();

  /* when scrolling to the bottom or to the right, `event.deltaY` will be a positive int ; when scrolling to the top or
  to the left, it will be a negative int.
  During my tests `event.deltaX` never changed and was always `0`, but I think it's because my mouse has a unidirectional
  wheel, while some other mouses can be have a bidirectional wheel, that's why I'm checking it to support all possible
  use cases */
  const scrollAmountDefault = (event.deltaY || event.deltaX);
  const scrollAmountCustom = scrollAmountDefault * settings.scrollSpeedMultiplier;

  // perform our custom scroll with a custom amount
  if (performHorizontalScroll)
    window.scrollBy(scrollAmountCustom, 0);
  else
    window.scrollBy(0, scrollAmountCustom);
}
