// a game by okaybenji & 23dogsinatrenchcoat
// inspired by the famicase of the same name: http://famicase.com/20/softs/080.html

const $ = query => document.querySelector(query);
const $$ = query => document.querySelectorAll(query);
const randomIntBetween = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const randomColor = () => {
  const minBrightness = 33;
  const maxBrightness = 67;
  const minSaturation = 75;

  let color = 'hsl(';
  color += randomIntBetween(0, 360) + ',';
  color += randomIntBetween(minSaturation, 100) + '%,';
  color += randomIntBetween(minBrightness, maxBrightness) + '%)';
  return color;
};

const screenCreatures = {
  roomId: 'start',
  rooms: [
    {
      name: 'Living Room',
      id: 'start',
      img: `
               
               
           o   o
            \\  |
             \\.|-.
             (\\|  )
    .==================.
    | .--------------. |
    | |--.__.--.__.--| |
    | |--.__.--.__.--| |
    | |--.__.--.__.--| |
    | |--.__.--.__.--| |
    | |--.__.--.__.--| |
    | '--------------'o|
    |     """"""""    o|
    '=================='
      `,
      desc: `You feel the glow of the television washing over you. You haven't yet dared to look directly at the screen.`,
      items: [
        {
          name: ['tv', 'television', 'screen'],
          desc: [
            `You feel something tug at you from the inside of your chest as you look at the screen. You feel an invisible hand pass though your skin as if you were clay and wrap its cold fingers around your lungs. You can’t breathe. 
The screen is filled with so many colors, swirling around in maddening patterns with no rhyme or reason. With each second you stare, it becomes harder and harder to look away. You swear you can see another pair of eyes looking back at you.`,
            `The colors begin to pour out of the screen until they envelop you like a cocoon. You feel the colors press against you, wrapping themselves around you like a second skin. The colors are suddenly seared away by a blinding white light. Yet still you see those eyes, wide and unblinking, seared on to the back of your eyelids. The light dissipates, and the world begins to come back into focus. 
You dare not close your eyes, for you know that if you do, it will be staring back at you.`],
          look({getRoom}) {
            // Get the TV ASCII art.
            const tv = $('.img');
            // Reset the innerHTML so this will work each time the player looks at the TV.
            tv.innerHTML = getRoom('start').img;
            // Add the scanline class to each line on the TV screen.
            tv.innerHTML = tv.innerHTML.replaceAll('--.__.--.__.--', `<span class="scanline">--.__.--.__.--</span>`);
            // Set each element of the screen to a random color.
            const scanlines = $$('.scanline')
            const colorElements = char => {
              scanlines.forEach(scanline => scanline.innerHTML = scanline.innerHTML.replaceAll(char, `<span class="randomColor">${char}</span>`));
            };
            ['-', '.', '_'].forEach(colorElements);
            $$('.randomColor').forEach(e => e.style = `color: ${randomColor()}`);
            // Oscillate the waves.
            $$('.randomColor').forEach(e => {
              if (e.innerText === '_') {
                e.classList.add('oscillateUp');
              } else if (e.innerText === '-') {
                e.classList.add('oscillateDown');
              }
            });
          },
        },
      ],
    },
  ],
};
