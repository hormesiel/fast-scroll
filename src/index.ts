declare const chrome;

//
// Imports
//

import { Settings, ScrollAxis } from './types';
import defaultSettings from './settings/default-settings';
import { urlMatchesAnyGlobOf } from './settings/ignored-urls';

//
// Variables
//

let pressedKeys = new Set<String>();
let settings: Settings;
let triggerKeyIsPressed = false;

const overflowValuesThatEnableScrollbarsOnContentElements = ['auto', 'overlay', 'scroll'];

//
// Init
//

loadSettings(() => {
  attachPageFocusLossListener();
  attachKeysListeners();
  attachWheelListener();
  console.debug('[fast-scroll] ready');
});

//
// Helpers
//

function attachPageFocusLossListener() {
  /* clear pressed keys when the page loses focus, because by default they stay pressed when tab-switching to another
  OS window, which causes unexpected scrolling behavior when returning to the browser */
  window.addEventListener('blur', () => {
    pressedKeys.clear();
    triggerKeyIsPressed = false;
  });
}

function attachKeysListeners() {
  window.addEventListener('keydown', event => {
    pressedKeys.add(event.code);
    triggerKeyIsPressed = pressedKeys.has(settings.triggerKey);
  });
  window.addEventListener('keyup', event => {
    pressedKeys.delete(event.code);
    triggerKeyIsPressed = pressedKeys.has(settings.triggerKey);
  });
}

function attachWheelListener() {
  if (settings.mode === Settings.Mode.OnTriggerKeyPressed)
    window.addEventListener('wheel', onWheelModeOnTriggerKeyPressed, { passive: false });
  else if (settings.mode === Settings.Mode.Always)
    window.addEventListener('wheel', onWheelModeAlways, { passive: false });
  else
    throw new Error(`Unknown mode '${settings.mode}'`);
}

function elementIsScrollable(element, axis: ScrollAxis): boolean {
  const elementComputedStyle = window.getComputedStyle(element);

  if (axis === 'horizontal') {
    // if the element is as big as its content, it can't be scrolled (and doesn't need to)
    if (element.scrollWidth === element.clientWidth)
      return false;

    // <body> and <html> elements are scrollable as long as their overflow content isn't hidden
    if (element instanceof HTMLBodyElement || element instanceof HTMLHtmlElement)
      return true;

    // other elements are scrollable only when their 'overflow-<axis>' CSS attr has a value that enables scrollbars
    return overflowValuesThatEnableScrollbarsOnContentElements.includes(elementComputedStyle.overflowX);
  }
  else {
    // if the element is as big as its content, it can't be scrolled (and doesn't need to)
    if (element.scrollHeight === element.clientHeight)
      return false;

    // <body> and <html> elements are scrollable as long as their overflow content isn't hidden
    if (element instanceof HTMLBodyElement || element instanceof HTMLHtmlElement)
      return true;

    // other elements are scrollable only when their 'overflow-<axis>' CSS attr has a value that enables scrollbars
    return overflowValuesThatEnableScrollbarsOnContentElements.includes(elementComputedStyle.overflowY);
  }
}

/**
 * @returns The first element in the `element`'s hierarchy (including the element itself) that has a scrollbar for the
 * given `axis`, or `null` if none has any.
 */
function findScrollTarget(element, axis: ScrollAxis) {
  if (elementIsScrollable(element, axis))
    return element;
  else if (element.parentElement)
    return findScrollTarget(element.parentElement, axis);
  return null;
}

function handleScroll(event: WheelEvent, speed: 'custom' | 'default') {
  event.preventDefault();

  const scrollAmount = (() => {
    /* When scrolling to the bottom or to the right, `event.deltaY` will be a positive int ; when scrolling to the top or
    to the left, it will be a negative int.
    During my tests `event.deltaX` never changed and was always `0`, but I think that's because my mouse has a
    unidirectional wheel, while some other mouses can be have a bidirectional wheel, that's why I'm checking it ‒ to
    [hopefully] support all possible use cases */
    const scrollAmountDefault = event.deltaY || event.deltaX;

    if (speed === 'custom')
      return scrollAmountDefault * settings.scrollSpeedMultiplier;
    else if (speed === 'default')
      return scrollAmountDefault;
  })();

  /* Use the first scrollable element in the target's hierachy's instead of `window` to allow to scroll faster not only
  in the page itself but also in inner elements, like text areas or divs with overflow content. This also allows the
  extension to work on websites like Trello where the scrollable area isn't the <body> nor <html> element but a child
  element. */

  const axis: ScrollAxis = (pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight')) ? 'horizontal' : 'vertical';
  const scrollTarget = findScrollTarget(event.target, axis) || window; // if no scrollable element is found fallback to `window`

  if (axis === 'horizontal')
    scrollTarget.scrollBy(scrollAmount, 0);
  else
    scrollTarget.scrollBy(0, scrollAmount);
}

function loadSettings(callback: () => void) {
  // load saved settings
  chrome.storage.sync.get(defaultSettings, savedSettings => {
    settings = savedSettings;

    // if current URL doesn't match any ignore glob
    if (!urlMatchesAnyGlobOf(window.location.href, settings.ignoredUrls))
      callback();
  });

  // listen to changes
  chrome.storage.onChanged.addListener(changes => {
    if (changes.mode)
      settings.mode = changes.mode.newValue;
    if (changes.scrollSpeedMultiplier)
      settings.scrollSpeedMultiplier = changes.scrollSpeedMultiplier.newValue;
    if (changes.triggerKey)
      settings.triggerKey = changes.triggerKey.newValue;
  });
}

function onWheelModeAlways(event: WheelEvent) {
  // brackets are important here because of this: https://gist.github.com/flawyte/e7e39d1d48aa1d5e7512b21bb8429b1f
  if (triggerKeyIsPressed) {
    if (settings.triggerKey === Settings.TriggerKey.ControlLeft)
      handleScroll(event, 'default'); // handle normal scroll by ourself since by default ControlLeft is used to zoom in/out on the page
  }
  else if (!pressedKeys.has('ControlLeft')) // pass if ControlLeft is pressed to preserve default zoom in/out behavior
    handleScroll(event, 'custom');
}

function onWheelModeOnTriggerKeyPressed(event: WheelEvent) {
  if (triggerKeyIsPressed)
    handleScroll(event, 'custom');
}
