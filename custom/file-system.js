const logo =
`            █████████ ███████  ██   ██  █████████               
              ██    ██        ██ ██       ██                  
              ██   █████     ███      ██   █████            
              ██   ██       ██ ██     ██                  
              ██   ███████  ██   ███    ██                  

         ███████  ███   ██   ██████   ██  ███  ███  ███████ 
         ██       ████  ██  ██        ██  ████  ██  ██      
         █████   ██ ██  ██  ██  ████  ██  ██ ██ ██  █████   
         ██     ██  ██ ██  ██   ██  ██  ██  ██ ██  ██      
         ███████  ██   ████   ██████   ██  ██  ████  ███████
`;

const introText = `
This is a live demo of a game made using text-engine, a text adventure game engine written in JavaScript. It's small and easy to use with no dependencies. Read the docs on Github and you can make your own adventure game! github.com/okaybenji/text-engine

This demo game is a little obtuse. Try typing something and hitting ENTER. Don't trust everything it tells you. (You will know when you reach the true ending.)

`;

const inputs = ['']; // store all user commands
let inputsPos = 0;

const inputBox = document.querySelector('#input');

const println = (str, isImg = false, isCode = false) => {
  const output = document.querySelector('#output');
  const newLine = isCode ? document.createElement('code') : document.createElement('div');

  if (isImg || isCode) {
    newLine.classList.add('img');
    // Preserve characters normally lost in HTML.
    str = str.split('').reduce((image, char) => {
      // Preserve spaces.
      if (char === ' ') {
        return image + char + '\u00A0';
      }
      // Preserve backslashes.
      if (char === '\\') {
        return image + char + '\\';
      }

      return image + char;
    }, '');
  }

  output.appendChild(newLine).innerText = str;
  window.scrollTo(0, document.body.scrollHeight);
};

const applyInput = (e) => {
  const ENTER = 13;

  if (e.keyCode !== ENTER) {
    return;
  }

  inputs.push(inputBox.value);
  inputsPos = inputs.length;
  println('X:\\> ' + inputBox.value);

  const val = inputBox.value.toLowerCase().trim();
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

println(logo, false, true);
println(introText);
println('X:\\>');
