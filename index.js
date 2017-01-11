const loadDisk = (disk) => {
  // Disk -> Disk
  const init = (disk) => {
    const initializedDisk = Object.assign({}, disk);
    initializedDisk.rooms = disk.rooms.map((room) => {
      room.visits = 0;
      return room;
    });

    return initializedDisk;
  };

  disk = init(disk);

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
    // TODO: why doesn't this scroll to bottom on initial load?
    output.scrollTop = output.scrollHeight;
  };

  // String -> Room
  const getRoom = (id) => {
    return disk.rooms.find(room => room.id === id);
  };

  const enterRoom = (id) => {
    const room = getRoom(id);

    println(room.img, true);

    println(`---${room.name}---`);

    if (room.visits === 0) {
      println(room.desc);
    }

    room.visits++;

    disk.roomId = id;
  };

  const startGame = (disk) => {
    enterRoom(disk.roomId);
  };

  startGame(disk);

  const applyInput = (e) => {
    const ENTER = 13;

    if (e.keyCode !== ENTER) {
      return;
    }

    const val = inputBox.value;
    inputBox.value = ''; // reset input field
    println('> ' + val);

    inputs.push(val);
    inputsPos = inputs.length;

    const exec = (cmd) => {
      if (cmd) {
        cmd();
      } else {
        println('Sorry, I didn\'t understand your input. For a list of available commands, type HELP.');
      }
    };

    const args = val.split(' ');
    const cmd = args[0];
    const room = getRoom(disk.roomId);

    // nested strategy pattern
    // 1st tier based on # of args in user input
    // 2nd tier based on 1st arg (command)
    const strategy = {
      1() {
        const cmds = {
          look() {
            println(room.desc);
          },
          go() {
            const exits = room.exits;
            if (!exits) {
              println('There\'s nowhere to go.');
              return;
            }
            println('Where would you like to go? Available directions are:');
            exits.forEach(exit => println(exit.dir));
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
            println(instructions);
          },
        };
        exec(cmds[cmd]);
      },
      2() {
        const cmds = {
          look() {
            println(`You look ${args[1]}.`);
          },
          go() {
            const exits = room.exits;
            if (!exits) {
              println('There\'s nowhere to go.');
              return;
            }
            const nextRoom = exits.find(exit => exit.dir === args[1]);
            if (!nextRoom) {
              println('There is no exit in that direction.');
            } else {
              enterRoom(nextRoom.id);
            }
          },
          take() {
            const findItem = item => item.name === args[1];
            const itemIndex = room.items && room.items.findIndex(findItem);
            if (typeof itemIndex === 'number' && itemIndex > -1) {
              const item = room.items[itemIndex];
              if (item.isTakeable) {
                disk.inventory.push(item);
                room.items.splice(itemIndex, 1);
                println(`You took the ${item.name}.`);
              } else {
                println('You can\'t take that.');
              }
            } else {
              println('You don\'t see any such thing.');
            }
          },
          use() {
            const findItem = item => item.name === args[1];
            const item = (room.items && room.items.find(findItem)) || disk.inventory.find(findItem);

            if (item) {
              if (item.use) {
                item.use({disk, println, getRoom, enterRoom}); // use item and give it a reference to the game
              } else {
                println('That item doesn\'t have a use.');
              }
            } else {
              println('You don\'t have that.');
            }
          }
        };
        exec(cmds[cmd]);
      },
      3() {
        const cmds = {
          look() {
            const findItem = item => item.name === args[2];
            const item = (room.items && room.items.find(findItem)) || disk.inventory.find(findItem);
            if (!item) {
              println('You don\'t see any such thing.');
            } else {
              println(item.desc);
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
};
