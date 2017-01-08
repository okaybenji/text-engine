// TODO: import doesn't work in chrome yet, but eventually, do this:
// import cart from 'unlimited-adventure'; // like a game cart, get it?

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

  strategy = {
    1() {
      print(1);
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

  console.log(e.keyCode);

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

  console.log('history:', history);
  console.log('setting input to:', history[historyPos]);
  input.value = history[historyPos] || '';
  return;
}

input.onkeydown = navigateHistory;

// Cart -> Cart
const init = (cart) => {
  const initializedCartridge = Object.assign({}, cart);
  initializedCartridge.rooms = cart.rooms.map((room) => {
    room.visits = 0;
    return room;
  });

  return initializedCartridge;
};

// Cart, String -> Room
const getRoom = (cart, id) => {
  return cart.rooms.find(room => room.id === id);
};

// Cart, String
const enterRoom = (cart, id) => {
  const room = getRoom(cart, cart.startingRoom);
  print(room.img, true);

  if (room.visits === 0) {
    print(room.longDesc);
  } else {
    print(room.desc);
  }

  room.visits++;
};

const look = (cart, id) => {
  const room = getRoom(cart, cart.startingRoom);
  print(room.longDesc);
};

const startGame = (cart) => {
  enterRoom(cart, cart.startingRoom);
};

const cart = init(unlimitedAdventure);
startGame(cart);
