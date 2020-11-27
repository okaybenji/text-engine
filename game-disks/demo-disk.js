const selectStylesheet = filename => document.getElementById('styles').setAttribute('href', filename);

const demoDisk = {
  roomId: 'foyer',
  rooms: [
    {
      id: 'foyer',
      name: 'The Foyer',
      desc:  `Welcome to the TEXT-ENGINE demo disk! This demo disk is a text adventure game designed to introduce you to the features available to you in text-engine. Using this engine, you can make a text game of your own.

      You are currently standing in the FOYER of the demo disk. Rooms form the foundation of the engine's design. At any given time, your player will be standing in one of the rooms your built for them on your game's disk. These can be literal rooms like the foyer you find yourself in now, or metaphorical rooms like "THE END OF TIME" or "PURGATORY".

      Each room you build should have a DESC (description). That's what you're reading now!`,
      items: [
        {
          name: 'style-changer',
          onUse: () => {
            const currentStylesheet = document.getElementById('styles').getAttribute('href');
            const newName = currentStylesheet.includes('modern') ? 'retro' : 'modern';
            println(`You changed the stylesheet to ${newName.toUpperCase()}.css`);
            selectStylesheet(`styles/${newName}.css`);
          }
        }
      ]
    }
  ]
};
