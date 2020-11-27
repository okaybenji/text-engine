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
        room.desc = `You are currently standing in the FOYER. Rooms form the foundation of the engine's design. At any given time, your player will be standing in one of the rooms your built for them on your game's disk. These can be literal rooms like the foyer you find yourself in now, or metaphorical rooms like "THE END OF TIME" or "PURGATORY".

        Each room you build should have a description. That's what you're reading now!

        Rooms can also contain items. Type ITEMS to see a list of items in the FOYER. Or type HELP to see what else you can do!`;
      },
      items: [
        {
          name: 'style-changer',
          desc: 'Type USE STYLE-CHANGER to try it out!',
          isTakeable: true,
          onUse: () => {
            const currentStylesheet = document.getElementById('styles').getAttribute('href');
            const newName = currentStylesheet.includes('modern') ? 'retro' : 'modern';
            println(`You changed the stylesheet to ${newName.toUpperCase()}.css
            Since text-engine is built with HTML, you can use Cascading Stylesheets (CSS) to make your game look however you want!`);
            selectStylesheet(`styles/${newName}.css`);
          }
        }
      ]
    }
  ]
};
