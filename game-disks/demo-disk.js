const selectStylesheet = filename => document.getElementById('styles').setAttribute('href', filename);

const demoDisk = {
  roomId: 'foyer',
  rooms: [
    {
      id: 'foyer',
      name: 'The Foyer',
      desc:  `Welcome to the TEXT-ENGINE demo disk! This disk is a text adventure game designed to introduce you to the features available to you in text-engine. Using this engine, you can make a text game of your own.

      Type LOOK to have a look around.`,
      onLook: () => {
        const room = getRoom('foyer');
        room.desc = `You are currently standing in the FOYER. There's a huge MONSTERA plant to your right, and a massive WINDOW to your left bathing the room in natural light. Both the PLANT and the WINDOW stretch to the ceiling, which must be at least 25 feet high.

        Rooms form the foundation of the engine's design. At any given time, your player will be standing in one of the rooms you built for them on your game's disk. These can be literal rooms like the foyer you find yourself in now, or metaphorical rooms like "THE END OF TIME" or "PURGATORY".

        Each room you create should have a description. (That's what you're reading now!)

        Rooms can have exits that take you to other rooms. For instance, to the NORTH is the RECEPTION DESK.

        Rooms can also contain items. Sometimes the player can TAKE or USE items. Type ITEMS to see a list of items in the FOYER. Or type HELP to see what else you can do!`;
      },
      items: [
        {
          name: ['monstera', 'plant', 'swiss cheese'],
          desc: `Sometimes called a Swiss Cheese plant, no office is complete without one. It has lovely, large leaves. This is the biggest you\'ve ever seen.

          There's SOMETHING SHINY in the pot.`,
          block: `It's far too large for you to carry.`,
          onLook: () => {
            const foyer = getRoom('foyer');
            foyer.items.push({
              name: ['shiny thing', 'something shiny', 'pot'],
              onUse: () => {
                const room = getRoom(disk.roomId);
                if (room.id === 'foyer') {
                  println(`There's nothing to unlock in the foyer.`);
                } else if (room.id === 'reception') {
                  println(`You unlock the door to the EAST!`);
                  // remove the block
                  const exit = room.exits.find(exit => exit.dir === 'east');
                  delete exit.block;
                  // this item can only be used once
                  const key = getItemInInventory('shiny');
                  delete key.onUse;
                }
              },
              desc: `It's a key!`,
              onLook: () => {
                const key = getItemInInventory('shiny') || getItemInRoom('shiny', 'foyer');
                // now that we know it's a key, place that name first so the engine calls it by that name
                key.name.unshift('silver key');
                // remove this method (we don't need it anymore)
                delete key.onLook;
              },
              isTakeable: true,
            })
          },
        },
        {
          name: 'tall window',
          desc: `All you can see are puffy white clouds over a blue sky.`,
        },
        {
          name: 'dime',
          desc: `Wow, ten cents.`,
          isTakeable: true,
          onTake: () => println(`You bend down and pick up the tiny, shiny coin. Now it's in your INVENTORY, and you can use it at any time, in any room. (Don't spend it all in one place!)
          Type INV to see a list of items in your inventory.`),
          onUse: () => {
            const side = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
            println(`You flip the dime. It lands on ${side}.`);
          },
        }
      ],
      exits: [
        {dir: 'north', id: 'reception'},
      ],
    },
    {
      id: 'reception',
      name: 'Reception Desk',
      desc: `BENJI is here. I'm sure he'd be happy to tell you more about the features available in text-engine. You can speak with characters using the TALK command.

      To the EAST is a closed door.

      To the SOUTH is the FOYER where you started your adventure.`,
      items: [
        {
          name: 'desk',
        },
        {
          name: 'door',
          desc: `There are 4" metal letters nailed to the door. They spell out: "ADVANCED".`,
          onUse: () => {
            const reception = getRoom('reception');
            const exit = reception.exits.find(exit => exit.dir === 'east');
            if (exit.block) {
              println(`It's locked.`);
            } else {
              goDir('east');
            }
          },
        },
      ],
      exits: [
        {dir: 'east', id: 'advanced', block: `The door is locked.`},
        {dir: 'south', id: 'foyer'},
      ],
    },
    {
      id: 'advanced',
      name: 'Advanced Research Lab',
      desc: `There is a BLUE ROBOT hovering silently in the center of a white void. They appear to be awaiting instructions.`,
    },
  ],
  characters: [
    {
      name: ['Benji', 'Benj', 'receptionist'],
      roomId: 'reception',
      desc: 'He looks... helpful!',
      onTalk: () => println(`"Hi," he says, "How can I help you?"`),
      topics: [
        {
          option: `Tell me about EXITS`,
          line: `"Sure! It looks like you've already figured out you can type GO NORTH to use an exit to the north. But did you know you can just type GO to get a list of exits from the room? If an exit leads you to a room you've been to before, it will even tell you the room's name.

          "There are also some shortcuts to make getting where you're going easier. Instead of typing GO NORTH, you can just type NORTH instead. Actually, for cardinal directions, you can shorten it to simply N.

          "Lastly, sometimes you'll want to temporarily prevent players from using an exit. You can use BLOCKS for this. Try going EAST from here to see what I mean. You'll find the DOOR is locked. You'll need to find the KEY to get out of here.`,
          removeOnRead: true,
        },
        {
          option: 'How can I change the LOOK of the game?',
          removeOnRead: true,
          onSelected() {
            println(`BENJI pulls a strange-looking ITEM out of a desk drawer.
            "Here, take this." he says. "Try typing USE STYLE-CHANGER. That should give you some ideas."`)

            disk.inventory.push({
              name: 'style-changer',
              desc: `This is a magical item. Type USE STYLE-CHANGER to try it out!`,
              onUse: () => {
                const currentStylesheet = document.getElementById('styles').getAttribute('href');
                const newName = currentStylesheet.includes('modern') ? 'retro' : 'modern';
                println(`You changed the stylesheet to ${newName.toUpperCase()}.css
                Since text-engine is built with HTML, you can use Cascading Stylesheets (CSS) to make your game look however you want!`);
                selectStylesheet(`styles/${newName}.css`);
              }
            });
          },
        },
        {
          option: `Remind me what's up with that DOOR to the east...`,
          line: `The exit currently has a "block". Specifically, the DOOR it locked. You'll need to find a KEY to open it.`,
          prereqs: ['exits'],
        },
        {
          option: `I can has AUTOCOMPLETE?`,
          line: `"Yeah! If you type a few letters and press TAB, the engine will guess what you're trying to say."`,
          removeOnRead: true,
        },
        {
          option: `If I want to REPEAT a command, do I have to type it again?`,
          line: `"Wow, it's almost like you're reading my mind. No, you just just press the UP ARROW to see commands you've previously entered."`,
          removeOnRead: true,
        },
      ],
    },
    {
      name: 'blue robot',
      roomId: 'advanced',
      onTalk: () => println(`"I can tell you about making games with text-engine," they explain. "What would you like to know?"`),
      topics: [
        {
          option: `What is TEXT-ENGINE?`,
          line: `text-engine is a a JavaScript REPL-style text-based adventure game engine. It's small and easy to use with no dependencies.

          The engine uses a disk metaphor for the data which represents your game, like the floppy disks of yore.

          The engine's code is contained in the file called index.js. Including index.js in your index.html file adds a single function to the global namespace called loadDisk. loadDisk accepts a single argument, which is your disk -- a standard JavaScript object (JSON).`
        },
        {
          option: `How do I get STARTED?`,
          line: `To create your own adventure, you use this game disk as a template. You will find it in game-disks/demo-disk.js. There are a couple other example games included in that directory as well. You can edit these in any text editor or code editor.

          Include the 'game disk' (JSON data) in index.html and load it with loadDisk(myGameData). You can look at the included index.html file for an example.`
        },
        {
          option: `What is a DISK?`,
          line: `A disk is a JavaScript object which describes your game. At minimum, it must have these two top-level properties:

          roomId (string) - This is a reference to the room the player currently occupies. Set this to the ID of the room the player should start in.

          rooms (array) - List of rooms in the game.

          There are other properties you can choose to include if you like:

          inventory (array) - List of items in the player's inventory.

          characters (array) - List of characters in the game.

          You can also attach any arbitrary data you wish. For instance, you could have a number called "health" that you used to keep track of your player's condition.`
        },
        {
          option: `What is a ROOM?`,
          line: `A room is a JavaScript object. You usually want a room to have the following properties:

          name (string) - The name of the room will be displayed each time it is entered.

          id (string) - Unique identifier for this room. Can be anything.

          desc (string) - Description of the room, displayed when it is first entered, and also when the player issues the LOOK command.

          exits (array) - List of paths from this room.

          Rooms can have these other optional properties as well:

          img (string) - Graphic to be displayed each time the room is entered. (This is intended to be ASCII art.)

          items (string) - List of items in this room. Items can be interacted with by the player.

          onEnter (function) - Function to be called when the player enters this room.

          onLook (function) - Function to be called when the player issues the LOOK command in this room.`
        },
        {
          option: `What is an EXIT?`,
          line: `An exit is a JavaScript object with the following properties:

          dir (string) - The direction the player must go to leave via this exit (e.g. "north").

          id (string) - The ID of the room this exit leads to.

          An exit can optionally have a BLOCK as well:

          block (string) - Line to be printed if the player tries to use this exit. If this property exists, the player cannot use the exit.`
        },
        {
          option: `What is an ITEM?`,
          line: `An item is a JavaScript object with a name:

          name (string or array) - How the item is referred to by the game and the player. Using an array allows you to define multiple string names for the item. You might do this if you expect the player may call it by more than one name. For instance ['basketball', 'ball']. When listing items in a room, the engine will always use the first name in the list.

          Items can have these other optional properties as well:

          desc (string or array) - Description. Text displayed when the player looks at the item. If multiple descriptions are provided, one will be chosen at random.

          isTakeable (boolean) - Whether the player can pick up this item (if it's in a room). Defaults to false.

          onUse (function) - Function to be called when the player uses the item.

          onLook (function) - Function to be called when the player looks at the item.

          onTake (function) - Function to be called when the player takes the item.`
        },
        {
          option: `What is a CHARACTER?`,
          line: `You're talking to one! A character is a JavaScript object with the following properties:

          name (string or array) - How the character is referred to by the game and the player. Using an array allows you to define multiple string names for the character. You might do this if you expect the player may call them by more than one name. For instance ['Steve', 'waiter', 'garçon']. When characters items in a room, the engine will always use the first name in the list.

          roomId (string) - The ID of the room the character is currently in. The player can only talk to characters in the room with them.

          Characters can have these other optional properties as well:

          desc (string) - Description. Text displayed when the player looks at the character. If multiple descriptions are provided, one will be chosen at random.

          topics (string or array) - If a string is provided, it will be printed when the player talks to this character. Otherwise, this should be a list of topics for use in the conversation with the character

          onTalk (function) - Function to be called when the player talks to the character.`
        },
        {
          option: `What is a TOPIC?`,
          line: `A topic is something you can talk to a character about, and is a JavaScript object with the following properties:`
        }
      ],
    },
  ]
};
