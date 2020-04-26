const sfx = {
  boot: new Audio('./sounds/boot.webm'),
  keypress: new Audio('./sounds/keypress.webm'),
};

const playSound = (name) => {
  sfx[name].play();
  sfx[name].currentTime = 0;
};

// Play the sound for the boot sequence.
playSound('boot');

// Override the keypress listener to also play a typing sound.
// Capture the original method.
const originalOnKeyDown = document.onkeydown;
document.onkeydown = document.onkeypress = (event) => {
  // Call the original method.
  originalOnKeyDown(event);
  
  // Add the sound.
  playSound('keypress');
};
