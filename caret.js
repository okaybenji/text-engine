const caret = document.querySelector('#caret');

const onKeyDown = (event) => {
  // ensure focus is on the input
  input.focus();

  // bail if this is a backspace
  if (event.keyCode === 8) {
    return;
  }

  // ensure text cursor is at the end of the text
  input.selectionStart = input.selectionEnd = 10000;

  // move the caret to the left of the input text, plus the width of one character
  caret.style.left = (input.value.length * 1.75 - 96) + 'vh';
};

// update position after character is in text box
const onKeyUp = () => {
  // move the caret to the left of the input text
  caret.style.left = (input.value.length * 1.75 - 98) + 'vh';
};
document.onkeydown = document.onkeypress = onKeyDown;
document.onkeyup = onKeyUp;

// initialize caret position
onKeyUp();
