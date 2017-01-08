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

const print = (str, isImg) => {
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

  const val = input.value;
  input.value = ''; // reset input field
  print('> ' + val);

  history.push(val);
  historyPos = history.length;

  const args = val.split(' ');

  // nested strategy pattern
  // 1st tier based on # of args in user input
  // 2nd tier based on 1st arg (command)
  strategy = {
    1() {
      strategy = {
        look() {
          const room = getRoom(cart.roomId);
          print(room.desc);
        },
        go () {
          print('Where would you like to go? Available directions are:');
          cart.room.exits.forEach(exit => print(exit.dir));
        }
      };
      strategy[args[0]]();
    },
    2() {
      print(2);
    },
    3() {
      print(3);
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
}

input.onkeydown = navigateHistory;

// String -> Room
const getRoom = (id) => {
  return cart.rooms.find(room => room.id === cart.roomId);
};

// Cart, String
const enterRoom = (id) => {
  const room = getRoom(cart.roomId);
  print(room.img, true);

  print(`---${room.name}---`);

  if (room.visits === 0) {
    print(room.desc);
  }

  room.visits++;

  cart.room = room;
};

const startGame = (cart) => {
  enterRoom(cart, cart.startingRoom);
};

startGame(cart);
