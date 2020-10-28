const input = document.querySelector('#input');

// get random array element
const pickOne = arr => arr[Math.floor(Math.random() * arr.length)];

// return the first name if it's an array, or the only name
const getName = name => typeof name === 'object' ? name[0] : name;

// get a character by name from a list of characters
const findCharacter = (name, chars = disk.characters) => chars.find((c) => {
  const hasName = n => {
    return n.toLowerCase().includes(name.toLowerCase());
  };
  // search through each variation of the name in an array
  if (typeof c.name === 'object') {
    return c.name.find(hasName);
  }

  return hasName(c.name);
});

// end the current conversation
const endConversation = () => {
  disk.conversant = undefined;
  disk.conversation = undefined;
};

// global properties that need to be assigned in loadDisk
let disk, println, getCharactersInRoom, getRoom, enterRoom;

document.onkeydown = () => {
  input.focus();
};

const loadDisk = (uninitializedDisk, config = {}) => {
  // get a list of all characters in the passed room
  getCharactersInRoom = (roomId) => disk.characters.filter(c => c.roomId === roomId);

  // build default (DOM) configuration
  const defaults = {
    // retrieve user input (remove whitespace at beginning or end)
    getInput: () => input.value.trim(),
    // overwrite user input
    setInput: (str) => {
      input.value = str;
      // on the next frame, move the cursor to the end of the line
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = input.value.length;
      });
    },
    // render output
    println: (line, isImg = false, isName = false, isDesc = false) => {
      // bail if string is null or undefined
      if (!line) {
        return;
      }

      // if this is an array of lines, pick one at random
      str = typeof line === 'object' ? pickOne(line) : line;

      const output = document.querySelector('#output');
      const newLine = document.createElement('div');

      if (isImg) {
        newLine.classList.add('img');
      }

      if (isName) {
        newLine.classList.add('roomname');
      }

      if (isDesc) {
        newLine.classList.add('desc');
      }

      // add a class for styling prior user input
      if (line[0] === '>') {
        newLine.classList.add('user');
      }

      output.appendChild(newLine).innerText = str;
      window.scrollTo(0, document.body.scrollHeight);
    },
    enterRoom: (id) => {
      const room = getRoom(id);

      println(room.img, true);

      println(`${getName(room.name)}`,false,true);

      if (room.visits === 0) {
        println(room.desc,false,false,true);
      }

      room.visits++;

      disk.roomId = id;

      if (typeof room.onEnter === 'function') {
        room.onEnter({disk, println, getRoom, enterRoom});
      }

      // reset any active conversation
      delete disk.conversant;
    },
    // prepare the environment
    setup: ({applyInput = (() => {}), navigateHistory = (() => {})}) => {
      input.onkeypress = (e) => {
        const ENTER = 13;

        if (e.keyCode === ENTER) {
          applyInput();
        }
      };

      input.onkeydown = (e) => {
        const UP = 38;
        const DOWN = 40;

        if (e.keyCode === UP) {
          navigateHistory('prev');
        } else if (e.keyCode === DOWN) {
          navigateHistory('next');
        }
      };
    }
  };

  // Debugging: Allow pressing > to force characters to move to adjacent rooms.
  document.onkeypress = function (e) {
    if (e.keyCode == 62) {
      disk.characters.map(c => c.updateLocation({println, disk}));
    }
  };

  const configuration = Object.assign(defaults, config);
  const {getInput, setInput, setup} = configuration;
  println = configuration.println;
  enterRoom = configuration.enterRoom;

  // Disk -> Disk
  const init = (disk) => {
    const initializedDisk = Object.assign({}, disk);
    initializedDisk.rooms = disk.rooms.map((room) => {
      room.visits = 0;
      return room;
    });

    if (!initializedDisk.inventory) {
      initializedDisk.inventory = [];
    }

    if (!initializedDisk.characters) {
      initializedDisk.characters = [];
    }

    return initializedDisk;
  };

  disk = init(uninitializedDisk);

  const inputs = ['']; // store all user commands
  let inputsPos = 0;

  // String -> Room
  getRoom = (id) => disk.rooms.find(room => room.id === id);

  const startGame = (disk) => {
    enterRoom(disk.roomId);
  };

  startGame(disk);

  const applyInput = () => {
    const input = getInput();
    inputs.push(input);
    inputsPos = inputs.length;
    println(`> ${input}`);

    const val = input.toLowerCase();
    setInput(''); // reset input field

    const exec = (cmd) => {
      if (cmd) {
        cmd();
      } else {
        println(`Sorry, I didn't understand your input. For a list of available commands, type HELP.`);
      }
    };

    let args = val.split(' ')
      // remove articles
      .filter(arg => arg !== 'a' && arg !== 'an' && arg != 'the');

    if (disk.conversant && args.length === 1) {
      // if player is in a conversation, assume the argument is a topic
      args = ['talk', 'about', args[0]];
    }

    let cmd = args[0];
    const room = getRoom(disk.roomId);

    // nested strategy pattern
    // 1st tier based on # of args in user input
    // 2nd tier based on 1st arg (command)
    const strategy = {
      1() {
        const cmds = {
          inv() {
            if (!disk.inventory.length) {
              println(`You don't have any items in your inventory.`);
              return;
            }
            println(`You have the following items in your inventory:`);
            disk.inventory.forEach(item => {
              println(`* ${getName(item.name)}`);
            });
          },
          look() {
            println(room.desc,false,false,true);
          },
          go() {
            const exits = room.exits;
            if (!exits) {
              println(`There's nowhere to go.`);
              return;
            }
            println(`Where would you like to go? Available directions are:`);
            exits.forEach((exit) => {
              const rm = getRoom(exit.id);

              if (!rm) {
                return;
              }

              println(
                rm.visits > 0
                  ? `${getName(exit.dir)} - ${rm.name}`
                  : getName(exit.dir)
              );
            });
          },
          // shortcuts for cardinal directions
          n() {
            cmd = 'go';
            args[1] = 'north';
            strategy['2']();
          },
          s() {
            cmd = 'go';
            args[1] = 'south';
            strategy['2']();
          },
          e() {
            cmd = 'go';
            args[1] = 'east';
            strategy['2']();
          },
          w() {
            cmd = 'go';
            args[1] = 'west';
            strategy['2']();
          },
          ne() {
            cmd = 'go';
            args[1] = 'northeast';
            strategy['2']();
          },
          se() {
            cmd = 'go';
            args[1] = 'southeast';
            strategy['2']();
          },
          sw() {
            cmd = 'go';
            args[1] = 'southwest';
            strategy['2']();
          },
          nw() {
            cmd = 'go';
            args[1] = 'northwest';
            strategy['2']();
          },
          talk() {
            println(`You can talk TO someone or ABOUT some topic.`);
          },
          take() {
            const items = (room.items || []).filter(item => item.isTakeable);
            if (!items.length) {
              println(`There's nothing to take.`);
              return;
            }
            println(`What would you like to take? Available items are:`);
            items
              .forEach(item => println(getName(item.name)));
          },
          items() {
            const items = (room.items || []);
            if (!items.length) {
              println(`There's nothing here.`);
              return;
            }
            println(`You see the following:`);
            items
              .forEach(item => println(getName(item.name)));
          },
          help() {
            const instructions = `
              The following commands are available:
              LOOK :: repeat room description
              LOOK AT [OBJECT NAME] e.g. 'look at key'
              TAKE [OBJECT NAME] e.g. 'take book'
              GO [DIRECTION] e.g. 'go north'
              USE [OBJECT NAME] e.g. 'use door'
              TALK TO [CHARACTER NAME] e.g. 'talk to mary'
              TALK ABOUT [SUBJECT] e.g. 'talk about horses'
              INV :: list inventory items
              HELP :: this help menu
            `;
            println(instructions);
          },
          say() {
            println([`Say what.`, `You don't say.`])
          },
          play() {
            println(`You're already playing a game.`);
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
              println(`There's nowhere to go.`);
              return;
            }
            const nextRoom = exits.find(exit =>
              typeof exit.dir === 'object'
                ? exit.dir.includes(args[1])
                : exit.dir === args[1]
            );

            if (!nextRoom) {
              println(`There is no exit in that direction.`);
            } else if (nextRoom.block) {
              println(nextRoom.block);
            } else {
              enterRoom(nextRoom.id);
            }
          },
          take() {
            const findItem = item => item.name === args[1] || item.name.includes(args[1]);
            let itemIndex = room.items && room.items.findIndex(findItem);
            if (typeof itemIndex === 'number' && itemIndex > -1) {
              const item = room.items[itemIndex];
              if (item.isTakeable) {
                disk.inventory.push(item);
                room.items.splice(itemIndex, 1);

                if (typeof item.onTake === 'function') {
                  item.onTake({disk, println, room, getRoom, enterRoom, item});
                } else {
                  println(`You took the ${getName(item.name)}.`);
                }
              } else {
                println(`You can't take that.`);
              }
            } else {
              itemIndex = disk.inventory.findIndex(findItem);
              if (typeof itemIndex === 'number' && itemIndex > -1) {
                println(`You already have that.`);
              } else {
                println(`You don't see any such thing.`);
              }
            }
          },
          use() {
            const findItem = item => item.name === args[1] || item.name.includes(args[1]);
            const item = (room.items && room.items.find(findItem)) || disk.inventory.find(findItem);

            if (item) {
              if (item.use) {
                // use item and give it a reference to the game
                if (typeof item.use === 'string') {
                  const use = eval(item.use);
                  use({disk, println, getRoom, enterRoom, item});
                } else if (typeof item.use === 'function') {
                  item.use({disk, println, getRoom, enterRoom, item});
                }
              } else {
                println(`That item doesn't have a use.`);
              }
            } else {
              println(`You don't have that.`);
            }
          },
          say() {
            println(`You say ${args[1]}.`);
          },
          play() {
            println(`You're already playing a game.`);
          },
        };
        exec(cmds[cmd]);
      },
      3() {
        const cmds = {
          look() {
            const findItem = item => item.name === args[2] || item.name.includes(args[2]);
            const item = (room.items && room.items.find(findItem)) || disk.inventory.find(findItem);
            if (item) {
              // Look at an item.
              if (item.desc) {
                println(item.desc);
              } else {
                println(`You don\'t notice anything remarkable about it.`);
              }

              if (typeof(item.look) === 'function') {
                item.look({disk, println, getRoom, enterRoom, item});
              }
            } else {
              const character = findCharacter(args[2], getCharactersInRoom(room.id));
              if (character) {
                // Look at a character.
                if (character.desc) {
                  println(character.desc);
                } else {
                  println(`You don't notice anything remarkable about them.`);
                }
              } else {
                println(`You don't see any such thing.`);
              }
            }
          },
          say() {
            const str = args.splice(1).reduce((cur, acc) => cur + ' ' + acc, `You say `) + '.';
            println(str);
          },
          talk() {
            let preposition = args[1];
            if (preposition !== 'to' && preposition !== 'about') {
              println(`You can talk TO someone or ABOUT some topic.`);
              return;
            }

            const character =
              preposition === 'to' && findCharacter(args[2], getCharactersInRoom(room.id))
                ? findCharacter(args[2], getCharactersInRoom(room.id))
                : disk.conversant;
            let topics;

            // give the player a list of topics to choose from for the character
            // (if this is a branching conversation, list possible responses)
            const listTopics = (character) => {
              disk.conversation = topics;

              if (topics.length) {
                println(`What would you like to discuss?`);
                topics.forEach(topic => println(topic.option ? topic.option : topic.keyword.toUpperCase()));
                println(`NOTHING`);
              } else if (Object.keys(topics).length) {
                println(`Select a response:`);
                Object.keys(topics).forEach(topic => println(topics[topic].response));
              } else {
                endConversation();
              }
            };

            if (preposition === 'to') {
              if (!findCharacter(args[2])) {
                println(`There is no one here by that name.`);
                return;
              }

              if (!findCharacter(getName(args[2]), getCharactersInRoom(room.id))) {
                println(`There is no one here by that name.`);
                return;
              }

              if (!character.topics) {
                println(`You have nothing to discuss with ${getName(character.name)} at this time.`);
                return;
              }

              if (typeof(character.topics) === 'string') {
                println(character.topics);
                return;
              }

              if (typeof(character.onTalk) === 'function') {
                character.onTalk({disk, println, getRoom, enterRoom, room, character});
              }

              topics = typeof character.topics === 'function'
                ? character.topics({println, room})
                : character.topics;

              if (!topics.length && !Object.keys(topics).length) {
                println(`You have nothing to discuss with ${getName(character.name)} at this time.`);
                return;
              }

              disk.conversant = character;
              listTopics(topics);
            } else if (preposition === 'about'){
              if (!disk.conversant) {
                println(`You need to be in a conversation to talk about something`);
                return;
              }
              const character = eval(disk.conversant);
              if (getCharactersInRoom(room.id).includes(disk.conversant)) {
                const response = args[2].toLowerCase();
                if (response === 'nothing') {
                  endConversation();
                } else if (disk.conversation && disk.conversation[response]) {
                  disk.conversation[response].onSelected();
                } else {
                  const topic = disk.conversation.length
                    && disk.conversation.find(t => t.keyword === response);
                  if (topic) {
                    if (topic.line) {
                      println(topic.line);
                    }
                    if (topic.cb) {
                      topic.cb({disk, println, getRoom, enterRoom, room, character});
                    }
                  } else {
                    println(`You talk about ${args[2]}.`);
                  }
                }

                // continue the conversation.
                if (disk.conversation) {
                  topics = typeof character.topics === 'function'
                    ? character.topics({println, room})
                    : character.topics;
                  listTopics(character);
                }
              } else {
                println(`That person is no longer available for conversation.`);
                disk.conversant = undefined;
                disk.conversation = undefined;
              }
            }
          }
        };

        exec(cmds[cmd]);
      }
    };

    if (args.length <= 3) {
      strategy[args.length]();
    } else {
      strategy[3]();
    }
  };

  const navigateHistory = (dir) => {
    if (dir === 'prev') {
      inputsPos--;
      if (inputsPos < 0) {
        inputsPos = 0;
      }
    } else if (dir === 'next') {
      inputsPos++;
      if (inputsPos > inputs.length) {
        inputsPos = inputs.length;
      }
    }

    setInput(inputs[inputsPos] || '');
  };

  setup({applyInput, navigateHistory});
};

// npm support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = loadDisk;
}
