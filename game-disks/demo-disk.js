const demoDisk = () => ({
  roomId: 'foyer', // the ID of the room the player starts in
  rooms: [
    {
      id: 'foyer', // unique ID for this room
      name: 'The Foyer', // room name (shown when player enters the room)
      // room description (shown when player first enters the room)
      desc:  `Welcome to the **TEXT-ENGINE** demo disk! This disk is a text adventure game designed to introduce you to the features available to you in **text-engine**. Using this engine, you can make a text game of your own.

      Type **LOOK** to have a look around.`,
      // optional callback when player issues the LOOK command
      // here, we use it to change the foyer's description
      onLook: () => {
        const room = getRoom('foyer');
        room.desc = `You are currently standing in the foyer. There's a huge **MONSTERA** plant to your right, and a massive **WINDOW** to your left bathing the room in natural light. Both the **PLANT** and the **WINDOW** stretch to the ceiling, which must be at least 25 feet high.

        ***Rooms** form the foundation of the engine's design. At any given time, your player will be standing in one of the rooms you built for them. These can be literal rooms like the foyer you find yourself in now, or metaphorical rooms like **The End of Time** or **A Dream**.

        Each room you create should have a description. (That's what you're reading now!)

        Rooms can have **exits** that take you to other rooms. For instance, to the **NORTH** is the **RECEPTION DESK**.

        Rooms can also contain **items**. Sometimes the player can **TAKE** or **USE** items.

        Type **ITEMS** to see a list of items in the foyer. Or type **HELP** to see what else you can do!`;
      },
      // optional list of items in the room
      items: [
        {
          name: 'tall window', // the item's name
          desc: `All you can see are puffy white clouds over a blue sky.`, // description shown when player looks at the item
        },
        {
          name: ['monstera', 'plant', 'swiss cheese'], // player can refer to this item by any of these names
          desc: `Sometimes called a Swiss Cheese plant, no office is complete without one. It has lovely, large leaves. This is the biggest you\'ve ever seen.

          There's **SOMETHING SHINY** in the pot.`,
          block: `It's far too large for you to carry.`, // optional reason player cannot pick up this item
          // when player looks at the plant, they discover a shiny object which turns out to be a key
          onLook: () => {
            if (getItem('shiny')) {
              // the key is already in the pot or the player's inventory
              return;
            }

            const foyer = getRoom('foyer');

            // put the silver key in the pot
            foyer.items.push({
              name: ['shiny thing', 'something shiny', 'pot'],
              onUse() {
                const room = getRoom(disk.roomId);
                if (room.id === 'foyer') {
                  println(`There's nothing to unlock in the foyer.`);
                } else if (room.id === 'reception') {
                  println(`You unlock the door to the **EAST**!`);
                  // remove the block
                  const exit = getExit('east', room.exits);
                  delete exit.block;
                  // this item can only be used once
                  const key = getItem('shiny');
                  key.onUse = () => println(`The lab has already been unlocked.`);
                } else {
                  println(`There's nothing to unlock here.`);
                }
              },
              desc: `It's a silver **KEY**!`,
              onLook() {
                const key = getItem('shiny');

                // now that we know it's a key, place that name first so the engine calls it by that name
                key.name.unshift('silver key');

                // let's also update the description
                key.desc = `It has a blue cap with the word "LAB" printed on it.`;

                // remove this method (we don't need it anymore)
                delete key.onLook;
              },
              isTakeable: true,
              onTake() {
                println(`You took it.`);
                // update the monstera's description, removing everything starting at the line break
                const plant = getItem('plant');
                plant.desc = plant.desc.slice(0, plant.desc.indexOf('\n'));
              },
            });
          },
        },
        {
          name: 'dime',
          desc: `Wow, ten cents.`,
          isTakeable: true, // allow the player to TAKE this item
          onTake: () => println(`You bend down and pick up the tiny, shiny coin.

          *Now it's in your **inventory**, and you can use it at any time, in any room. (Don't spend it all in one place!)

          Type **INV** to see a list of items in your inventory.*`),
          // using the dime randomly prints HEADS or TAILS
          onUse() {
            const side = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
            println(`You flip the dime. It lands on ${side}.`);
          },
        }
      ],
      // places the player can go from this room
      exits: [
        // GO NORTH command leads to the Reception Desk
        {dir: 'north', id: 'reception'},
      ],
    },
    {
      id: 'reception',
      name: 'Reception Desk',
      desc: `**BENJI** is here. I'm sure he'd be happy to tell you more about the features available in **text-engine**.

      *You can speak with characters using the **TALK** command.*

      To the **EAST** is a closed **DOOR**.

      To the **SOUTH** is the foyer where you started your adventure.

      Next to the **DESK** are **STAIRS** leading **UP**.`,
      items: [
        {
          name: 'desk',
        },
        {
          name: 'door',
          desc: `There are 4" metal letters nailed to the door. They spell out: "RESEARCH LAB".`,
          onUse() {
            const reception = getRoom('reception');
            const exit = getExit('east', reception.exits);
            if (exit.block) {
              println(`It's locked.`);
            } else {
              goDir('east');
            }
          },
        },
        {
          name: 'gate',
          desc: `The guilded gate is blocking the way to the **STAIRS**.`,
        },
        {
          name: ['stairs', 'staircase'],
          desc: `They lead up to a door. If you squint, you can make out the word "ADVANCED" on the door.`,
          onUse: () => println(`Try typing GO UPSTAIRS (once you've unlocked the gate).`),
        },
      ],
      exits: [
        // exits with a BLOCK cannot be used, but print a message instead
        {dir: 'east', id: 'lab', block: `The door is locked.`},
        {dir: ['upstairs', 'up'], id: 'advanced', block: `There's a locked GATE blocking your path.`},
        {dir: 'south', id: 'foyer'},
      ],
    },
    {
      id: 'lab',
      name: 'Research Lab',
      desc: `There is a **BLUE ROBOT** hovering silently in the center of a white void. They appear to be awaiting instructions. (Type **TALK** to speak to the robot.)

      To the **WEST** is the door to the Reception Desk.`,
      exits: [
        {dir: 'west', id: 'reception'},
      ],
    },
    {
      id: 'advanced',
      name: 'Advanced Research Lab',
      desc: `There is a **RED ROBOT** hovering silently in the center of a black void. They appear to be awaiting instructions. (Type **TALK** to speak to the robot.)

      **DOWNSTAIRS** is the Reception Desk.`,
      exits: [
        {dir: ['downstairs', 'down'], id: 'reception'},
      ],
    },
  ],
  characters: [
    {
      name: ['Benji', 'Benj', 'receptionist'],
      roomId: 'reception',
      desc: 'He looks... helpful!', // printed when the player looks at the character
      img: `
      .------\\ /------.
      |       -       |
      |               |
      |               |
      |               |
   _______________________
   ===========.===========
     / ~~~~~     ~~~~~ \\
    /|     |     |\\
    W   ---  / \\  ---   W
    \\.      |o o|      ./
     |                 |
     \\    #########    /
      \\  ## ----- ##  /
       \\##         ##/
        \\_____v_____/
  
      `,
      // optional callback, run when the player talks to this character
      onTalk: () => println(`"Hi," he says, "How can I help you?"`),
      // things the player can discuss with the character
      topics: [
        {
          option: 'How can I change the visual **STYLE** of the game?',
          removeOnRead: true,
          // optional callback, run when the player selects this option
          onSelected() {
            println(`**BENJI** pulls a strange-looking *item* out of a desk drawer.
            "Here, take this." he says. "Try typing **USE STYLE-CHANGER**. That should give you some ideas."`)

            // add a special item to the player's inventory
            disk.inventory.push({
              name: ['style-changer', 'stylechanger'],
              desc: `This is a magical item. Type **USE STYLE-CHANGER** to try it out!`,
              onUse: () => {
                const currentStylesheet = document.getElementById('styles').getAttribute('href');
                const newName = currentStylesheet.includes('modern') ? 'retro' : 'modern';
                println(`You changed the stylesheet to ${newName.toUpperCase()}.css.
                Since **text-engine** is built with HTML, you can use Cascading Stylesheets (CSS) to make your game look however you want!`);
                selectStylesheet(`styles/${newName}.css`);
              }
            });
          },
        },
        {
          option: 'How can I use **RICH** text?',
          line: `"The text in the game is actually HTML, so you can use tags like <code>&lt;b&gt;</code> for <b>bold</b>, <code>&lt;i&gt;</code> for <i>italic</i>, and <code>&lt;u&gt;</code> for <u>underline</u>.

          "There's also support for Markdown-like syntax:

          • Wrapping some text in asterisks like &ast;this&ast; will *italicize* it.
          • Double-asterisks like &ast;&ast;this&ast;&ast; will make it **bold**.
          • Triple-asterisks like &ast;&ast;&ast;this&ast;&ast;&ast; will make it ***italic bold***.
          • Double-underscores like &lowbar;_this&lowbar;_ will __underline__ it."`,
          removeOnRead: true,
        },
        {
          option: `Tell me about **EXITS**`,
          // text printed when the player selects this option by typing the keyword (EXITS)
          line: `"Sure! It looks like you've already figured out you can type **GO NORTH** to use an exit to the north. But did you know you can just type **GO** to get a list of exits from the room? If an exit leads you to a room you've been to before, it will even tell you the room's name.

          "There are also some shortcuts to make getting where you're going easier. Instead of typing **GO NORTH**, you can just type **NORTH** instead. Actually, for cardinal directions, you can shorten it to simply **N**.

          "Sometimes you'll want to temporarily prevent players from using an **exit**. You can use *blocks* for this. Try going **EAST** from here to see what I mean. You'll find the **DOOR** is locked. You'll need to find the **KEY** to get inside.

          "These **STAIRS** are also blocked by a locked **GATE**. There isn't a key to the gate, so if you want to see what's up there, you'll have to find another way to get past it."`,
          // instruct the engine to remove this option once the player has selected it
          removeOnRead: true,
        },
        {
          option: `Remind me what's up with that **DOOR** to the east...`,
          line: `"The exit has a *block*. Specifically, the **DOOR** it locked. You'll need to find a **KEY** to open it."`,
          prereqs: ['exits'], // optional list of prerequisite topics that must be discussed before this option is available
        },
        {
          option: `Remind me what's up with these **STAIRS**...`,
          line: `"The **STAIRS** are blocked by a locked **GATE**. There isn't a key, so you need to find another way to unlock it."`,
          prereqs: ['exits'],
        },
        {
          option: `How do I use **AUTOCOMPLETE**?`,
          line: `"If you type a few letters and press TAB, the engine will guess what you're trying to say."`,
          removeOnRead: true,
        },
        {
          option: `If I want to **REPEAT** a command, do I have to type it again?`,
          line: `"Wow, it's almost like you're reading my mind. No, you can just press the UP ARROW to see commands you've previously entered."`,
          removeOnRead: true,
        },
      ],
    },
    {
      name: 'blue robot',
      roomId: 'lab',
      onTalk: () => println(`"I can tell you about making games with text-engine," they explain. "What would you like to know?"`),
      topics: [
        {
          option: `What is **TEXT-ENGINE**?`,
          line: `**text-engine** is a a JavaScript REPL-style, text-based adventure game engine. It's small and easy to use with no dependencies.

          The engine uses a disk metaphor for the data which represents your game, like the floppy disks of yore.`
        },
        {
          option: `How do I get **STARTED**?`,
          line: `To create your own adventure, you can use an existing game disk as a template. You will find the disk you're playing now as well as others in the folder called "game-disks". You can edit these in any text or code editor.

          Include the 'game disk' (JSON data) in index.html and load it with loadDisk(myGameData). You can look at <a href="https://github.com/okaybenji/text-engine/blob/master/index.html" target="_blank">the included index.html file</a> for an example.

          You are welcome to ask me about any topic you like, but you might find it easier just to browse a few and then dive in to making something of your own. You can return to ask me questions at any time.`
        },
        {
          option: `What is a **DISK**?`,
          line: `A disk is a JavaScript function returning an object which describes your game. At minimum, the returned object must have these two top-level properties:

          **roomId** (*string*) - This is a reference to the room the player currently occupies. Set this to the **ID** of the room the player should start in.

          **rooms** (*array*) - List of rooms in the game.

          There are other properties you can choose to include if you like:

          **inventory** (*array*) - List of items in the player's inventory.

          **characters** (*array*) - List of characters in the game.

          You can also attach any arbitrary data you wish. For instance, you could have a number called "health" that you use to keep track of your player's condition.`
        },
        {
          option: `What is a **ROOM**?`,
          line: `A room is a JavaScript object. You usually want a room to have the following properties:

          **name** (*string*) - The name of the room will be displayed each time it is entered.

          **id** (*string*) - Unique identifier for this room. Can be anything.

          **desc** (*string*) - Description of the room, displayed when it is first entered, and also when the player issues the **LOOK** command.

          **exits** (*array*) - List of paths from this room.

          Rooms can have these other optional properties as well:

          **img** (*string*) - Graphic to be displayed each time the room is entered. (This is intended to be ASCII art.)

          **items** (*string*) - List of items in this room. Items can be interacted with by the player.

          **onEnter** (*function*) - Function to be called when the player enters this room.

          **onLook** (*function*) - Function to be called when the player issues the **LOOK** command in this room.`
        },
        {
          option: `What is an **EXIT**?`,
          line: `An exit is a JavaScript object with the following properties:

          **dir** (*string*) - The direction the player must go to leave via this exit (e.g. "north").

          **id** (*string*) - The ID of the room this exit leads to.

          An exit can optionally have a *block* as well:

          **block** (*string*) - Line to be printed if the player tries to use this exit. If this property exists, the player cannot use the exit.`
        },
        {
          option: `What is an **ITEM**?`,
          line: `An item is a JavaScript object with a name:

          **name** (*string* or *array*) - How the item is referred to by the game and the player. Using an array allows you to define multiple string names for the item. You might do this if you expect the player may call it by more than one name. For instance <code>['basketball', 'ball']</code>. When listing items in a room, the engine will always use the first name in the list.

          Items can have these other optional properties as well:

          **desc** (*string* or *array*) - Description. Text displayed when the player looks at the item. If multiple descriptions are provided, one will be chosen at random.

          **isTakeable** (*boolean*) - Whether the player can pick up this item (if it's in a room). Defaults to <code>false</code>.

          **onUse** (*function*) - Function to be called when the player uses the item.

          **onLook** (*function*) - Function to be called when the player looks at the item.

          **onTake** (*function*) - Function to be called when the player takes the item.`
        },
        {
          option: `What is a **CHARACTER**?`,
          line: `You're talking to one! A character is a JavaScript object with the following properties:

          **name** (*string or array*) - How the character is referred to by the game and the player. Using an array allows you to define multiple string names for the character. You might do this if you expect the player may call them by more than one name. For instance <code>['Steve', 'waiter', 'garçon']</code>. When listing characters in a room, the engine will always use the first name in the list.

          **roomId** (*string*) - The ID of the room the character is currently in. The player can only talk to characters in the room with them.

          Characters can have these other optional properties as well:

          **desc** (*string* or *array*) - Description. Text displayed when the player looks at the character. If multiple descriptions are provided, one will be chosen at random.

          **topics** (*string* or *array*) - If a string is provided, it will be printed when the player talks to this character. Otherwise, this should be a list of topics for use in the conversation with the character.

          **onTalk** (*function*) - Function to be called when the player talks to the character.

          **onLook** (*function*) - Function to be called when the player looks at the character.`
        },
        {
          option: `What is a **TOPIC**?`,
          line: `A topic is something you can talk to a character about, and as you may have guessed, is a JavaScript object. A topic requires an *option*, and either a *line* or an *onSelected* function, or both:

          **option** (*string*) - The choice presented to the player, with a KEYWORD the player can type to select it. If the keyword is written in uppercase, the engine can identify it automatically. (Otherwise, you'll need to specify the keyword in a separate property.) The option can be just the keyword itself, or any string containing the keyword.

          **line** (*string*) - The text to display when the player types the keyword to select the option.

          **onSelected** (*function*) - Function to be called when the player types the keyword to select the option.

          Topics can have these other optional properties as well:

          **removeOnRead** (*boolean*) - Whether this option should no longer be available to the player after it has been selected once.

          **prereqs** (*array*) - Array of keyword strings representing the prerequisite topics a player must have selected before this one will appear. (When topics are selected, their keywords go into an array on the character called "chatLog".)

          **keyword** (*string*) - The word the player must type to select this option. This property is only required if the option itself does not contain a keyword written in uppercase.`
        },
        {
          option: `Can you unlock the **GATE** to the stairs by the reception desk?`,
          line: `Actually, you can do that yourself! This disk happens to have a secret, custom **UNLOCK** command. This powerful command will remove blocks on any exit. Just type **UNLOCK** to use it.`,
        },
      ],
    },
    {
      name: 'red robot',
      roomId: 'advanced',
      onTalk: () => println(`"I can tell you about the JavaScript functions available to you when you use text-engine," they explain. "What would you like to know about?"`),
      topics: [
        {
          option: `Tell me about **FUNCTIONS**`,
          line: `Functions are reuseable bits of JavaScript code. **text-engine** provides several of these which you can use, for instance in callbacks like <code>onUse</code>, <code>onLook</code>, <code>onEnter</code>, etc.`
        },
        {
          option: `Tell me about **COMMANDS**`,
          line: `Every command a player can issue in the game has a corresponding function in **text-engine**.

          For instance, there's a function called <code>go</code> that gets called when the player types **GO**.

          You can add your own custom commands, like the **UNLOCK** command you used to get access to this room. And if existing commands don't work how you want them to, you can ever override them by reassigning them to your own function code.`,
        },
        {
          option: `Tell me about **PRINTLN**`,
          line: `<code>println</code> is a function you can use to print a line of text to the console. It takes up to two arguments:

          **line** (*string*) - The text to be printed.

          **className** (*string*) - Optional. The name of a CSS class to apply to the line. You can use this to style the text.`
        },
        {
          option: `Tell me about **PICKONE**`,
          line: `<code>pickOne</code> is a function you can use to get a random item from an array. It takes one argument:

          **arr** (*array*) - The array with the items to pick from.`
        },
        {
          option: `Tell me about **GETROOM**`,
          line: `<code>getRoom</code> is a function you can use to get a reference to a room by its ID. It takes one argument:

          **id** (*string*) - The unique identifier for the room.`
        },
        {
          option: `Tell me about **ENTERROOM**`,
          line: `<code>enterRoom</code> is a function you can use to move the player to particular room. It takes one argument:

          **id** (*string*) - The unique identifier for the room.`
        },
        {
          option: `Tell me about **GETCHARACTER**`,
          line: `<code>getCharacter</code> is a function you can use to get a reference to a character. It takes up to two arguments:

          **name** (*string*) - The character's name.

          **chars** (*array*) - Optional. The array of characters to search. Defaults to searching all characters on the disk.`
        },
        {
          option: `Tell me about **GETCHARACTERSINROOM**`,
          line: `<code>getCharactersInRoom</code> is a function you can use to get an array containing references to each character in a particular room. It takes one argument:

          **roomId** (*string*) - The unique identifier for the room.`
        },
        {
          option: `Tell me about **GETITEM**`,
          line: `<code>getItem</code> is a function you can use to get a reference to an item in the player's inventory or in the current room. It takes one argument:

          **name** (*string*) - The name of the item.`
        },
        {
          option: `Tell me about **GETITEMINROOM**`,
          line: `<code>getItemInRoom</code> is a function you can use to get a reference to an item in any room. It takes two arguments:

          **itemName** (*string*) - The name of the item.

          **roomId** (*string*) - The unique identifier for the room.`
        },
        {
          option: `Tell me about **GETITEMININVENTORY**`,
          line: `<code>getItemInInventory</code> is a function you can use to get a reference to an item in the player's inventory. It takes one argument:

          **name** (*string*) - The name of the item.`
        },
        {
          option: `Tell me about **OTHER** functions`,
          line: `There are several other functions available in the engine! Feel free to take a peek at the source code (<a href="https://github.com/okaybenji/text-engine/blob/master/index.js" target="_blank">index.js</a>). It's designed to be open and simple to use and to customize.`
        },
      ],
    },
  ],
});

// custom functions used by this disk
// change the CSS stylesheet to the one with the passed name
const selectStylesheet = filename => document.getElementById('styles').setAttribute('href', filename);

// override commands to include custom UNLOCK command
// create the unlock function
const unlock = () => {
  disk.rooms.forEach(room => {
    if (!room.exits) {
      return;
    }

    // unblock all blocked exits in the room
    room.exits.forEach(exit => delete exit.block);
  });

  // update the description of the gate
  getItemInRoom('gate', 'reception').desc = `The guilded gate leads to the staircase.`;

  println(`All **exits** have been unblocked!`);
};

// attach it to the zero-argument commands object on the disk
commands[0] = Object.assign(commands[0], {unlock});
