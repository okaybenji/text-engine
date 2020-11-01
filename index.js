// global properties, assigned with let for easy overriding by the user
let disk;

// store user input history
let inputs = [''];
let inputsPos = 0;

// reference to the input element
let input = document.querySelector('#input');

// add any default values to the disk, such as the number of times a room has been visited
// disk -> disk
let init = (disk) => {
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

// register listeners for input events
let setup = () => {
  input.addEventListener('keypress', (e) => {
    const ENTER = 13;

    if (e.keyCode === ENTER) {
      applyInput();
    }
  });

  input.addEventListener('keydown', (e) => {
    input.focus();

    const UP = 38;
    const DOWN = 40;
    const TAB = 9;

    if (e.keyCode === UP) {
      navigateHistory('prev');
    } else if (e.keyCode === DOWN) {
      navigateHistory('next');
    } else if (e.keyCode === TAB) {
      e.stopPropagation();
      e.preventDefault()
      autocomplete();
    }
  });

  input.addEventListener('focusout', () => {
    input.focus();
  });
};

// convert the disk to JSON and store it
// (optionally accepts a name for the save)
let save = (name = 'save') => {
  const save = JSON.stringify(disk, (key, value) => typeof value === 'function' ? value.toString() : value);
  localStorage.setItem(name, save);
  println(`Game saved.`)
};

// restore the disk from storage
// (optionally accepts a name for the save)
let load = (name = 'save') => {
  const save = localStorage.getItem(name);
  disk = JSON.parse(save, (key, value) => {
    try {
      return eval(value);
    } catch (error) {
      return value;
    }
  });
  println(`Game loaded.`)
  enterRoom(disk.roomId);
};

// list player inventory
let inv = () => {
  if (!disk.inventory.length) {
    println(`You don't have any items in your inventory.`);
    return;
  }
  println(`You have the following items in your inventory:`);
  disk.inventory.forEach(item => {
    println(`* ${getName(item.name)}`);
  });
};

// show room description
let look = () => println(getRoom(disk.roomId).desc);

// look in the passed way
let lookThusly = (str) => println(`You look ${str}.`);

// look at the passed item or character
let lookAt = (name) => {
  const room = getRoom(disk.roomId);
  const findItem = item => item.name === name || item.name.includes(name);
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
    const character = findCharacter(name, getCharactersInRoom(room.id));
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
};

// list available exits
let go = () => {
  const room = getRoom(disk.roomId);
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

    const dir = getName(exit.dir).toUpperCase();

    println(
      rm.visits > 0
        ? `${dir} - ${rm.name}`
        : dir
    );
  });
};

// go the passed direction
let goDir = (dir) => {
  const room = getRoom(disk.roomId);
  const exits = room.exits;
  if (!exits) {
    println(`There's nowhere to go.`);
    return;
  }
  const nextRoom = exits.find(exit =>
    typeof exit.dir === 'object'
      ? exit.dir.includes(dir)
      : exit.dir === dir
  );

  if (!nextRoom) {
    println(`There is no exit in that direction.`);
  } else if (nextRoom.block) {
    println(nextRoom.block);
  } else {
    enterRoom(nextRoom.id);
  }
};

// shortcuts for cardinal directions
let n = () => goDir('north');
let s = () => goDir('south');
let e = () => goDir('east');
let w = () => goDir('west');
let ne = () => goDir('northeast');
let se = () => goDir('southeast');
let nw = () => goDir('northwest');
let sw = () => goDir('southwest');

// if there is one character in the room, engage that character in conversation
// otherwise, list characters in the room
let talk = () => {
  const chars = getCharactersInRoom(disk.roomId);
  // assume players wants to talk to the only character in the room
  if (chars.length === 1) {
    talkToOrAboutX('to', getName(chars[0].name));
    return;
  }
  println(`You can talk TO someone or ABOUT some topic.`);

  // list characters in the room
  cmd = 'chars';
  strategy['1']();
};

// speak to someone or about some topic
let talkToOrAboutX = (preposition, x) => {
  const room = getRoom(disk.roomId);

  if (preposition !== 'to' && preposition !== 'about') {
    println(`You can talk TO someone or ABOUT some topic.`);
    return;
  }

  const character =
    preposition === 'to' && findCharacter(x, getCharactersInRoom(room.id))
      ? findCharacter(x, getCharactersInRoom(room.id))
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
    if (!findCharacter(x)) {
      println(`There is no one here by that name.`);
      return;
    }

    if (!findCharacter(getName(x), getCharactersInRoom(room.id))) {
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
      println(`You need to be in a conversation to talk about something.`);
      return;
    }
    const character = eval(disk.conversant);
    if (getCharactersInRoom(room.id).includes(disk.conversant)) {
      const response = x.toLowerCase();
      if (response === 'nothing') {
        endConversation();
      } else if (disk.conversation && disk.conversation[response]) {
        disk.conversation[response].onSelected();
      } else {
        const topic = disk.conversation.length
          && disk.conversation.find(t => getKeywordFromTopic(t) === response);
        if (topic) {
          if (topic.line) {
            println(topic.line);
          }
          if (topic.cb) {
            topic.cb({disk, println, getRoom, enterRoom, room, character});
          }
        } else {
          println(`You talk about ${x}.`);
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
};

// list takeable items in room
let take = () => {
  const room = getRoom(disk.roomId);
  const items = (room.items || []).filter(item => item.isTakeable);
  if (!items.length) {
    println(`There's nothing to take.`);
    return;
  }
  println(`What would you like to take? Available items are:`);
  items
    .forEach(item => println(getName(item.name)));
};

// take the item with the given name
let takeItem = (itemName) => {
  const room = getRoom(disk.roomId);
  const findItem = item => item.name === itemName || item.name.includes(itemName);
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
};

// use the item with the given name
let useItem = (itemName) => {
  const room = getRoom(disk.roomId);
  const findItem = item => item.name === itemName || item.name.includes(itemName);
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
};

// list items in room
let items = () => {
  const room = getRoom(disk.roomId);
  const items = (room.items || []);
  if (!items.length) {
    println(`There's nothing here.`);
    return;
  }
  println(`You see the following:`);
  items
    .forEach(item => println(`* ${getName(item.name)}`));
}

// list characters in room
let chars = () => {
  const room = getRoom(disk.roomId);
  const chars = getCharactersInRoom(room.id);
  if (!chars.length) {
    println(`There's no one here.`);
    return;
  }
  println(`You see the following:`);
  chars
    .forEach(char => println(`* ${getName(char.name)}`));
};

// display help menu
let help = () => {
  const instructions = `
    The following commands are available:
    LOOK :: repeat room description
    LOOK AT [OBJECT NAME] e.g. 'look at key'
    TAKE [OBJECT NAME] e.g. 'take book'
    GO [DIRECTION] e.g. 'go north'
    USE [OBJECT NAME] e.g. 'use door'
    TALK TO [CHARACTER NAME] e.g. 'talk to mary'
    TALK ABOUT [SUBJECT] e.g. 'talk about horses'
    CHARS :: list characters in the room
    INV :: list inventory items
    ITEMS :: list items in the room
    SAVE :: save the current game
    LOAD :: load the last saved game
    HELP :: this help menu
  `;
  println(instructions);
};

// handle say command with no args
let say = () => println([`Say what?`, `You don't say.`]);

// say the passed string
let sayString = (str) => println(`You say ${str}.`);

// retrieve user input (remove whitespace at beginning or end)
// nothing -> string
let getInput = () => input.value.trim();

// process user input & update game state (bulk of the engine)
let applyInput = () => {
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
        inv,
        look,
        go,
        n,
        s,
        e,
        w,
        ne,
        se,
        sw,
        nw,
        talk,
        take,
        items,
        chars,
        help,
        say,
        save,
        load,
      };

      // handle shorthand direction command, e.g. "EAST" instead of "GO EAST"
      if (room.exits && room.exits.find(exit => exit.dir === cmd)) {
        goDir(cmd);
      } else {
        exec(cmds[cmd]);
      }
    },
    2() {
      const cmds = {
        look: () => lookThusly(args[1]),
        go: () => goDir(args[1]),
        take: () => takeItem(args[1]),
        use: () => useItem(args[1]),
        say: () => sayString(args[1]),
        save: () => save(args[1]),
        load: () => load(args[1]),
      };
      exec(cmds[cmd]);
    },
    3() {
      const cmds = {
        look: () => lookAt(args[2]),
        say() {
          const str = args.splice(1).reduce((cur, acc) => cur + ' ' + acc, '');
          sayString(str);
        },
        talk: () => talkToOrAboutX(args[1], args[2]),
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

// overwrite user input
let setInput = (str) => {
  input.value = str;
  // on the next frame, move the cursor to the end of the line
  setTimeout(() => {
    input.selectionStart = input.selectionEnd = input.value.length;
  });
};

// render output
let println = (line, isImg = false) => {
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

  // add a class for styling prior user input
  if (line[0] === '>') {
    newLine.classList.add('user');
  }

  output.appendChild(newLine).innerText = str;
  window.scrollTo(0, document.body.scrollHeight);
};

// predict what the user is trying to type
let autocomplete = () => {  
  const room = getRoom(disk.roomId);
  const words = input.value.toLowerCase().trim().split(/\s+/);
  const wordsSansStub = words.slice(0, words.length - 1);

  const stub = words[words.length - 1];
  let options;

  if (words.length === 1){
    options = ['look', 'take', 'talk', 'go', 'inv', 'help', 'exits', 'items', 'chars'];
    if (disk.conversation) {
      options = Array.isArray(disk.conversation)
        ? options.concat(disk.conversation.map(getKeywordFromTopic))
        : Object.keys(disk.conversation);
    }
  } else if (words.length === 2) {
    const optionMap = {
      talk: ['to', 'about'],
      take: (room.items || []).map(item => item.name),
      go: (room.exits || []).map(exit => exit.dir),
      look: ['at'],
    };
    options = optionMap[words[0]];
  } else if (words.length === 3) {
    const characterNames = (getCharactersInRoom(room.id) || []).map(character => character.name);
    const itemNames = (room.items || []).concat(disk.inventory).map(item => item.name);
    const optionMap = {
      to: characterNames,
      at: characterNames.concat(itemNames),
    };
    options = (optionMap[words[1]] || []).flat().map(string => string.toLowerCase());
  }

  const stubRegex = new RegExp(`^${stub}`);
  const matches = (options || []).flat().filter(option => option.match(stubRegex));

  if (!matches.length) {
    // do nothing; this needs refactoring.
  } else if (matches.length > 1) {
    const longestCommonStartingSubstring = (arr1) => {
      const arr = arr1.concat().sort();
      const a1 = arr[0];
      const a2 = arr[arr.length-1];
      const L = a1.length;
      let i = 0;
      while (i < L && a1.charAt(i) === a2.charAt(i)) {
        i++;
      }
      return a1.substring(0, i);
    };

    input.value = [...wordsSansStub,longestCommonStartingSubstring(matches)].join(' ');
  } else {
    input.value = [...wordsSansStub, matches[0]].join(' ');
  }
};

// select previously entered commands
let navigateHistory = (dir) => {
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

// get random array element
// array -> any
let pickOne = arr => arr[Math.floor(Math.random() * arr.length)];

// return the first name if it's an array, or the only name
// string | array -> string
let getName = name => typeof name === 'object' ? name[0] : name;

// retrieve room by its ID
// string -> room
let getRoom = (id) => disk.rooms.find(room => room.id === id);

// move the player into room with passed ID
// string -> nothing
let enterRoom = (id) => {
  const room = getRoom(id);

  println(room.img, true);

  println(`${getName(room.name)}`,false,true);

  if (room.visits === 0) {
    println(room.desc);
  }

  room.visits++;

  disk.roomId = id;

  if (typeof room.onEnter === 'function') {
    room.onEnter({disk, println, getRoom, enterRoom});
  }

  // reset any active conversation
  delete disk.conversant;
};

// get a list of all characters in the passed room
// string -> characters
let getCharactersInRoom = (roomId) => disk.characters.filter(c => c.roomId === roomId);

// get a character by name from a list of characters
// string, characters -> character
let findCharacter = (name, chars = disk.characters) => chars.find((c) => {
  const hasName = n => {
    return n.toLowerCase().includes(name.toLowerCase());
  };
  // search through each variation of the name in an array
  if (typeof c.name === 'object') {
    return c.name.find(hasName);
  }

  return hasName(c.name);
});

// retrieves a keyword from a topic
// topic -> string
let getKeywordFromTopic = (topic) => {
  if (topic.keyword) {
    return topic.keyword;
  }

  // find the keyword in the option
  // (the word in all caps)
  const removePunctuation = str => str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
  const removeExtraSpaces = str => str.replace(/\s{2,}/g," ");
  const keyword = removeExtraSpaces(removePunctuation(topic.option))
    // separate words by spaces
    .split(' ')
    // find the word that is in uppercase
    .find(w => w.toUpperCase() === w)
    .toLowerCase();

  return keyword;
};

// end the current conversation
let endConversation = () => {
  disk.conversant = undefined;
  disk.conversation = undefined;
};

// load the passed disk and start the game
let loadDisk = (uninitializedDisk) => {
  // initialize the disk
  disk = init(uninitializedDisk);

  // start the game
  enterRoom(disk.roomId);

  // start listening for user input
  setup();
};

// npm support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = loadDisk;
}
