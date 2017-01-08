// TODO: import doesn't work in chrome yet, but eventually, do this:
// import cart from 'unlimited-adventure'; // like a game cart, get it?

// Cart -> Cart
const init = (cart) => {
  const initializedCartridge = Object.assign({}, cart);
  initializedCartridge.rooms = cart.rooms.map((room) => {
    room.visits = 0;
    return room;
  });

  return initializedCartridge;
};

const cart = init(unlimitedAdventure);

const inputs = ['']; // store all user commands
let inputsPos = 0;

const inputBox = document.querySelector('#input');

const log = (str, isImg = false) => {
  const output = document.querySelector('#output');
  const newLine = document.createElement('div');

  if (isImg) {
    newLine.classList.add('img');
  }

  output.appendChild(newLine).innerText = str;
  output.scrollTop = output.scrollHeight;
};

// String -> Room
const getRoom = (id) => {
  return cart.rooms.find(room => room.id === id);
};

const enterRoom = (id) => {
  const room = getRoom(id);

  log(room.img, true);

  log(`---${room.name}---`);

  if (room.visits === 0) {
    log(room.desc);
  }

  room.visits++;

  cart.room = room;
};

const startGame = (cart) => {
  enterRoom(cart.roomId);
};

startGame(cart);

const applyInput = (e) => {
  const ENTER = 13;

  if (e.keyCode !== ENTER) {
    return;
  }

  const val = inputBox.value;
  inputBox.value = ''; // reset input field
  log('> ' + val);

  inputs.push(val);
  inputsPos = inputs.length;

  const exec = (cmd) => {
    if (cmd) {
      cmd();
    } else {
      log('Sorry, I didn\'t understand your input. For a list of available commands, type HELP.');
    }
  };

  const args = val.split(' ');
  const cmd = args[0];

  // nested strategy pattern
  // 1st tier based on # of args in user input
  // 2nd tier based on 1st arg (command)
  const strategy = {
    1() {
      const cmds = {
        look() {
          const room = getRoom(cart.roomId);
          log(room.desc);
        },
        go() {
          const exits = cart.room.exits;
          if (!exits) {
            log('There\'s nowhere to go.');
            return;
          }
          log('Where would you like to go? Available directions are:');
          exits.forEach(exit => log(exit.dir));
        },
        help() {
          const instructions = `
            The following commands are available:
            LOOK :: repeat room description
            LOOK AT [OBJECT NAME] e.g. 'look at key'
            TAKE [OBJECT NAME] e.g. 'take book'
            GO [DIRECTION] e.g. 'go north'
            USE [OBJECT NAME] e.g. 'use common sense'
            HELP :: this help menu
          `;
          log(instructions);
        },
      };
      exec(cmds[cmd]);
    },
    2() {
      const cmds = {
        look() {
          log(`You look ${args[1]}.`);
        },
        go() {
          const exits = cart.room.exits;
          if (!exits) {
            log('There\'s nowhere to go.');
            return;
          }
          const nextRoom = exits.find(exit => exit.dir === args[1]);
          if (!nextRoom) {
            log('There is no exit in that direction.');
          } else {
            enterRoom(nextRoom.id);
          }
        },
        take() {
          const findItem = item => item.name === args[1];
          const itemIndex = cart.room.items && cart.room.items.findIndex(findItem);
          if (typeof itemIndex === 'number' && itemIndex > -1) {
            const item = cart.room.items[itemIndex];
            if (item.isTakeable) {
              cart.inventory.push(item);
              cart.room.items.splice(itemIndex, 1);
              log(`You took the ${item.name}.`);
            } else {
              log('You can\'t take that.');
            }
          } else {
            log('You don\'t see any such thing.');
          }
        },
        use() {
          const findItem = item => item.name === args[1];
          const item = (cart.room.items && cart.room.items.find(findItem)) || cart.inventory.find(findItem);

          if (item) {
            if (item.use) {
              item.use();
            } else {
              log('That item doesn\'t have a use.');
            }
          } else {
            log('You don\'t have that.');
          }
        }
      };
      exec(cmds[cmd]);
    },
    3() {
      const cmds = {
        look() {
          const findItem = item => item.name === args[2];
          const item = (cart.room.items && cart.room.items.find(findItem)) || cart.inventory.find(findItem);
          if (!item) {
            log('You don\'t see any such thing.');
          } else {
            log(item.desc);
          }
        },
      };
      exec(cmds[cmd]);
    }
  };

  strategy[args.length]();
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
