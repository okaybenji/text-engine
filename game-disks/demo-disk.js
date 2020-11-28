const selectStylesheet = filename => document.getElementById('styles').setAttribute('href', filename);

const demoDisk = {
  roomId: 'foyer',
  rooms: [
    {
      id: 'foyer',
      name: 'The Foyer',
      desc:  `Welcome to the TEXT-ENGINE demo disk! This disk is a text adventure game designed to introduce you to the features available to you in text-engine. Using this engine, you can make a text game of your own.

      Type LOOK to have a look around.`,
      onLook() {
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
          desc: `Sometimes called a Swiss Cheese plant, no office is complete without one. It has lovely, large leaves. This is the biggest you\'ve ever seen.`,
          block: `It's far too large for you to carry.`,
        },
        {
          name: 'window',
          desc: `All you can see are puffy white clouds over a blue sky.`,
        },
        {
          name: 'dime',
          desc: `Wow, ten cents.`,
          isTakeable: true,
          onTake: () => println(`You bend down and pick up the tiny, shiny coin. Now it's in your INVENTORY, and you can use it at any time, in any room. (Don't spend it all in one place!)
          Type INV to see a list of items in your inventory.`),
          onUse() {
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

      To the EAST is a closed DOOR.

      To the SOUTH is the FOYER where you started your adventure.`,
      exits: [
        {dir: 'east', id: '?', block: `The door is locked.`},
        {dir: 'south', id: 'foyer'},
      ],
    },
    {
      id: '?',
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
          line: `"Sure! It looks like you've already figured out you can type, for instance, GO NORTH to use an exit to the north. But did you know you can just type GO to get a list of exits from the room? If an exit leads you to a room you've been to before, it will even tell you the room's name.

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
    }
  ]
};
