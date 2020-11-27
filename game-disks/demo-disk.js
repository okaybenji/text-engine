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
        room.desc = `You are currently standing in the FOYER. There's a huge MONSTERA plant to your right, and a massive WINDOW to your left bathing the room in natural light. Both the PLANT and the WINDOW stretch to the ceiling, which must be at least 25 feet.

        Rooms form the foundation of the engine's design. At any given time, your player will be standing in one of the rooms your built for them on your game's disk. These can be literal rooms like the foyer you find yourself in now, or metaphorical rooms like "THE END OF TIME" or "PURGATORY".

        Each room you build should have a description. That's what you're reading now!

        Rooms can have exits that take you to other rooms. For instance, to the NORTH is the RECEPTION DESK.

        Rooms can also contain items. Type ITEMS to see a list of items in the FOYER. Or type HELP to see what else you can do!`;
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
          name: 'style-changer',
          desc: 'This is a magical item. Type USE STYLE-CHANGER to try it out!',
          isTakeable: true,
          onUse: () => {
            const currentStylesheet = document.getElementById('styles').getAttribute('href');
            const newName = currentStylesheet.includes('modern') ? 'retro' : 'modern';
            println(`You changed the stylesheet to ${newName.toUpperCase()}.css
            Since text-engine is built with HTML, you can use Cascading Stylesheets (CSS) to make your game look however you want!`);
            selectStylesheet(`styles/${newName}.css`);
          }
        }
      ],
      exits: [
        {dir: 'north', id: 'reception'},
      ],
    },
    {
      id: 'reception',
      name: 'Reception Desk',
      desc: `BENJI is here. Type TALK to chat him up.`
    }
  ]
};
