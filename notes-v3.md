## Scrolling behaviors and extensions' modes

### Default behaviors without the extension

- AltLeft : *does nothing*
- ControlLeft : ZOOM IN/OUT
- ShiftLeft & ShiftRight : HORIZONTAL SCROLL


### Possible behaviors with the extension

`KeyToPress` = `'AltLeft'`

  NORMAL BEHAVIOR

    @ wheel
      - VERTICAL SCROLL handled by Chrome
    @ wheel + `ShiftLeft` | `ShiftRight`
      - HORIZONTAL SCROLL handled by Chrome

    @ wheel + `KeyToPress`
      - VERTICAL SCROLL handled by Fast Scroll
    @ wheel + `KeyToPress` + `ShiftLeft` | `ShiftRight`
      - HORIZONTAL SCROLL handled by Fast Scroll

  INVERTED BEHAVIOR

    @ wheel
      - VERTICAL SCROLL handled by Fast Scroll
    @ wheel + `ShiftLeft` | `ShiftRight`
      - HORIZONTAL SCROLL handled by Fast Scroll

    @ wheel + `KeyToPress`
      - VERTICAL SCROLL handled by Chrome
    @ wheel + `KeyToPress` + `ShiftLeft` | `ShiftRight`
      - HORIZONTAL SCROLL handled by Chrome


`KeyToPress` = `'ControlLeft'`

  NORMAL BEHAVIOR

    @ wheel
      - VERTICAL SCROLL handled by Chrome
    @ wheel + `ShiftLeft` | `ShiftRight`
      - HORIZONTAL SCROLL handled by Chrome

    @ wheel + `KeyToPress`
      - VERTICAL SCROLL handled by Fast Scroll
    @ wheel + `KeyToPress` + `ShiftLeft` | `ShiftRight`
      - HORIZONTAL SCROLL handled by Fast Scroll

  INVERTED BEHAVIOR

    @ wheel
      - VERTICAL SCROLL handled by Fast Scroll
    @ wheel + `ShiftLeft` | `ShiftRight`
      - HORIZONTAL SCROLL handled by Fast Scroll

    @ wheel + `KeyToPress`
      - ZOOM IN/OUT handled by Chrome
    @ wheel + `KeyToPress` + `ShiftLeft` | `ShiftRight`
      - ZOOM IN/OUT handled by Chrome

    /!\ In this case, the user will never be able to scroll at the default speed, UNLESS we handle the scroll by ourself when the `KeyToPress` is pressed.


`KeyToPress` = `'ShiftLeft'`

  NORMAL BEHAVIOR

    @ wheel
      - VERTICAL SCROLL handled by Chrome
    @ wheel + `ShiftLeft` | `ShiftRight`
      - VERTICAL SCROLL handled by Fast Scroll

    @ wheel + `KeyToPress`
      - VERTICAL SCROLL handled by Fast Scroll
    @ wheel + `KeyToPress` + `ShiftLeft` | `ShiftRight`
      - VERTICAL SCROLL handled by Fast Scroll

    /!\ In this case, the user will never be able to scroll horizontally by pressing the `ShiftLeft` key, which is Chrome's default behavior. However he should still be able to do it by pressing `ShiftRight`, even though it's humanly almost impossible (and certainly not convenient) to press these two keys at the same time with only one hand, which means the user won't be able to scroll horizontally *and* faster at the same time.

  INVERTED BEHAVIOR

    @ wheel
      - VERTICAL SCROLL handled by Fast Scroll
    @ wheel + `ShiftLeft` | `ShiftRight`
      - HORIZONTAL SCROLL handled by Chrome

    @ wheel + `KeyToPress`
      - HORIZONTAL SCROLL handled by Chrome
    @ wheel + `KeyToPress` + `ShiftLeft` | `ShiftRight`
      - HORIZONTAL SCROLL handled by Chrome

    /!\ In this case, the user will never be able to 1) scroll vertically at default speed and 2) scroll horizontally at increased speed.


### Possible solution that'll make everyone happy

- Allow the user to choose whether he wants to 1) only scroll faster when a key is pressed or 2) always scroll faster
- If he selects option 1), let him choose the key he want to press to trigger the faster scrolling : ControlLeft or AltLeft
  - If he chooses ControLeft, warn him about the Chrome's zoom in/out default behavior that'll be overriden
- If he selects option 2), let him choose whether he wants to be able to press a key to scroll slower (to default speed)
  - If he checks this option, let him choose the key he want to press : ControlLeft or AltLeft
    - If he chooses ControLeft, warn him about the Chrome's zoom in/out default behavior that'll be overriden

This implies rewriting the extension almost from scratch. If I do, let's take this opportunity to :
- [x] rename `keyToPress` to `triggerKey` (so simpler to type), in a backward-compatible way


### Tests

Mode = 'A l'appui sur la touche de déclenchement'
  Touche de déclenchement = 'AltLeft'
    Touche pas enfoncée
      @wheel: scroll Google Chrome
    Touche enfoncée
      @wheel: scroll Fast Scroll accéléré
    ControlLeft + @wheel
      @wheel: zoom in/out

  Touche de déclenchement = 'ControlLeft'
    Touche pas enfoncée
      @wheel: scroll Google Chrome
    Touche enfoncée
    ControlLeft + @wheel
      @wheel: scroll Fast Scroll accéléré

Mode = 'Toujours'
  Touche de déclenchement = 'AltLeft'
    Touche pas enfoncée
      @wheel: scroll Fast Scroll accéléré
    Touche enfoncée
      @wheel: scroll Google Chrome
    ControlLeft + @wheel
      @wheel: zoom in/out

  Touche de déclenchement = 'ControlLeft'
    Touche pas enfoncée
      @wheel: scroll Fast Scroll accéléré
    Touche enfoncée
    ControlLeft + @wheel
      @wheel: scroll Fast Scroll à vitesse normale


## Scroll targets

### https://www.deepskyfrontier.com/

  => html
    Horizontal => NO
      - el.scrollWidth === el.clientWidth
    Vertical => NO
      - el.scrollHeight === el.clientHeight

  => body
    Horizontal => YES
      - el.scrollWidth > el.clientWidth
      - el.style.overflowX === 'visible' (!== 'hidden')
    Vertical => YES
      - el.scrollHeight > el.clientHeight
      - el.style.overflowY === 'visible' (!== 'hidden')

  => #Layer1
    Horizontal => NO
      - el.scrollWidth === el.clientWidth
    Vertical => NO
      - el.scrollHeight > el.clientHeight
      - el.style.overflowY === 'visible' (!== 'auto', 'overlay', 'scroll')

### https://gist.github.com/flawyte

  => html
    Horizontal => NO
      - el.scrollWidth === el.clientWidth
    Vertical => YES
      - el.scrollHeight > el.clientHeight
      - el.style.overflowY === 'visible' (!== 'hidden')

  => body
    Horizontal => NO
      - el.scrollWidth === el.clientWidth
    Vertical => NO
      - el.scrollHeight === el.clientHeight

  => #file-default-sublime-keymap > div
    Horizontal => YES
      - el.scrollWidth > el.clientWidth
      - el.style.overflowX === 'visible' (!== 'hidden')
    Vertical => NO
      - el.scrollHeight === el.clientHeight

### https://gist.github.com/

  ONE FILE
    => html
      Horizontal => NO
        - el.scrollWidth === el.clientWidth
      Vertical => NO
        - el.scrollHeight === el.clientHeight

    => body
      Horizontal => NO
        - el.scrollWidth === el.clientWidth
      Vertical => NO
        - el.scrollHeight === el.clientHeight

  LOT OF FILES
    => html
      Horizontal => NO
        - el.scrollWidth === el.clientWidth
      Vertical => YES
        - el.scrollHeight > el.clientHeight
        - el.style.overflowY === 'visible' (!== 'hidden')

    => body
      Horizontal => NO
        - el.scrollWidth === el.clientWidth
      Vertical => NO
        - el.scrollHeight === el.clientHeight

### https://trello.com/

  BOARD
    => html
      Horizontal => NO
        - el.scrollWidth === el.clientWidth
      Vertical => NO
        - el.scrollHeight === el.clientHeight

    => body
      Horizontal => NO
        - el.scrollWidth === el.clientWidth
      Vertical => NO
        - el.scrollHeight === el.clientHeight

    => #board
      Horizontal => YES
        - el.scrollWidth > el.clientWidth
        - el.style.overflowY === 'auto' (!== 'hidden')
      Vertical => NO
        - el.scrollHeight === el.clientHeight

  CARD WITH VERTICAL OVERFLOW
    => html
      Horizontal => NO
        - el.scrollWidth === el.clientWidth
      Vertical => NO
        - el.scrollHeight === el.clientHeight

    => body
      Horizontal => NO
        - el.scrollWidth === el.clientWidth
      Vertical => NO
        - el.scrollHeight === el.clientHeight

    => #chrome-container > div.window-overlay
      Horizontal => NO
        - el.scrollWidth === el.clientWidth
      Vertical => YES
        - el.scrollHeight > el.clientHeight
        - el.style.overflowY === 'auto' (!== 'hidden')
