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

const history = ['']; // store all user commands
let historyPos = 0;

const input = document.querySelector('#input');

const print = (str, isImg = false) => {
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

  print(room.img, true);

  print(`---${room.name}---`);

  if (room.visits === 0) {
    print(room.desc);
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

  const val = input.value;
  input.value = ''; // reset input field
  print('> ' + val);

  history.push(val);
  historyPos = history.length;

  const exec = (cmd) => {
    if (cmd) {
      cmd();
    } else {
      print('Sorry, I didn\'t understand your input. For a list of available commands, type HELP.');
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
          print(room.desc);
        },
        go() {
          print('Where would you like to go? Available directions are:');
          cart.room.exits.forEach(exit => print(exit.dir));
        },
        help() {
          const instructions = `
            The following commands are available:
            LOOK :: repeat room description
            LOOK AT [OBJECT NAME] e.g. 'look at key'
            GO [DIRECTION] e.g. 'go north'
            HELP :: this help menu
          `;
          print(instructions);
        },
      };
      exec(cmds[cmd]);
    },
    2() {
      const cmds = {
        look() {
          print(`You look ${args[1]}.`);
        },
        go() {
          const nextRoom = cart.room.exits.find(exit => exit.dir === args[1]);
          if (!nextRoom) {
            print('There is no exit in that direction.');
          } else {
            enterRoom(nextRoom.id);
          }
        }
      };
      exec(cmds[cmd]);
    },
    3() {
      const cmds = {
        look() {
          const item = cart.room.items && cart.room.items.find(item => item.name === args[2]);
          if (!item) {
            print('You don\'t see any such thing.');
          } else {
            print(item.desc);
          }
        },
      };
      exec(cmds[cmd]);
    },
    4() {
      print(4);
    }
  };

  strategy[args.length]();
};

input.onkeypress = applyInput;

const navigateHistory = (e) => {
  const UP = 38;
  const DOWN = 40;

  if (e.keyCode !== UP && e.keyCode !== DOWN) {
    return;
  }

  if (e.keyCode === UP) {
    historyPos--;
    if (historyPos < 0) {
      historyPos = 0;
    }
  }

  if (e.keyCode === DOWN) {
    historyPos++;
    if (historyPos > history.length) {
      historyPos = history.length;
    }
  }

  input.value = history[historyPos] || '';
  return;
};

input.onkeydown = navigateHistory;
