const inputs = ['']; // store all user commands
let inputsPos = 0;

const inputBox = document.querySelector('#input');

const println = (str, isImg = false) => {
  const output = document.querySelector('#output');
  const newLine = document.createElement('div');

  if (isImg) {
    newLine.classList.add('img');
  }

  output.appendChild(newLine).innerText = str;
  output.scrollTop = output.scrollHeight;
};

const applyInput = (e) => {
  const ENTER = 13;

  if (e.keyCode !== ENTER) {
    return;
  }

  inputs.push(inputBox.value);
  inputsPos = inputs.length;
  println('X:\\> ' + inputBox.value);

  const val = inputBox.value.toLowerCase();
  inputBox.value = ''; // reset input field

  const exec = (cmd) => {
    if (typeof cmd === 'function') {
      cmd();
    } else {
      println(`'${cmd}' is not recognized as an internal or external command, operable program or batch file. For a list of available commands, type HELP.`);
    }
  };

  const args = val.split(' ');
  const cmd = args[0];

  const adventur = () => {
    loadDisk(unlimitedAdventure);
  };

  const cmds = {
    dir() {
      const output =
`Volume in drive X has no label
Directory of X:\\

ADVENTUR  EXE  3193  12-04-80  11:59a
1 file  521095 bytes free`;
      println(output, true);
    },
    adventur,
    'adventur.exe': adventur,
    'x:\\adventur': adventur,
    'x:\\adventur.exe': adventur,
    help() {
      const instructions =
`The following commands are available:

DIR   List files in current directory.
HELP  This help menu.`;
      println(instructions, true);
    },
  };

  exec(cmds[cmd] || cmd);
};

inputBox.onkeypress = applyInput;

const navigateHistory = (e) => {
  const UP = 38;
  const DOWN = 40;

  if (e.keyCode !== UP && e.keyCode !== DOWN) {
    return;
  }

  if (e.keyCode === UP) {
    inputsPos--;
    if (inputsPos < 0) {
      inputsPos = 0;
    }
  }

  if (e.keyCode === DOWN) {
    inputsPos++;
    if (inputsPos > inputs.length) {
      inputsPos = inputs.length;
    }
  }

  inputBox.value = inputs[inputsPos] || '';
  return;
};

inputBox.onkeydown = navigateHistory;

println('X:\\>');
