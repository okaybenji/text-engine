const unlimitedAdventure = {
  roomId: 'gameOver',
  inventory: [],
  rooms: [
    {
      name: 'GAME OVER',
      id: 'gameOver',
      img: `
               T~~
               |
              /"\\
      T~~     |'| T~~
  T~~ |    T~ WWW |
  |  /"\\   |  | | /\\T~~
 /"\\ WWW  /"\\ |' |WW|
WWWWW/\\| /   \\|'/\\|/"\\
|   /__\\/_WWW_\\/__\\WWWW
\\"  WWWW'|___|'WWWW'  /
 |  |' |/  -  \\|' |' |
 |' |  |WWWWWWW|' |  |
 |  |' | |[-]| |  |' |
 |  |  | |[-]| |  |  |
'---'--'-/___\\-'--'---'
      `,
      desc: `
        Congratulations, IkariDude09! You have defeated the evil emperor Zylzyx and restored peace to the k†ngdøm.
        You have no quests left to complete. Stay tuned for more adventures from SquigglySoft!
      `,
      items: [
        { name: 'castle', desc: 'It\'s quite impressive.' },
      ],
      exits: [
        { dir: 'north', id: 'endOfTheWorld' }
      ]
    },
    {
      name: 'The End of the World',
      id: 'endOfTheWorld',
      img: `
               T~~
               |
              /█\\
      0~1     1'1 0~~
  0~~ 1    0~ 010 1
  1  /█\\   1  1 1 /\\T~~
 /█\\ 010  /█\\ 1' |0|
0000/\\| 0   \\|'/\\|/█\\
|   1__\\/_101_\\/__\\0110
\\█  11WW'|_0_|'0011'  /
 1  1' |/  -  \\|' |' |
 10 |  |1011000|' |  1
 1  |' | |[-0| |  |' 0
 0  |  | 10-]| |  |  1
'0--'--'-/___\\-'1101--'
      `,
      desc: `
        I don't know how you got here, but you definitely don't belong here. This is the End of the World. You already saved the k\†ngd\øm. It's time for you to leave.
      `,
      // This is just here as an example of how you can use the onEnter property.
      onEnter: ({disk, println, getRoom}) => {
        console.log('Entered', disk.roomId); // Logs "Entered endOfTheWorld"
      },
      items: [
        { name: 'key', desc: 'It looks like a key.', isTakeable: true, use: ({disk, println, getRoom}) => {
          const room = getRoom(disk.roomId);
          const door = room.items.find(item => item.name === 'door');
          if (door) {
            println('The door has opened!');
            door.isOpen = true;
          } else {
            println('There\'s nothing to use the key on.');
          }
        }},
        { name: 'book', desc: 'It appears to contain some sort of encantation, or perhaps... code.', isTakeable: true, use: ({disk, println, getRoom}) => {
          const room = getRoom(disk.roomId);
          const door = room.items.find(item => item.name === 'door');

          if (door) {
            println('You already used the book!');
            return;
          }

          println('A door has appeared from nothing! It seems to go nowhere...');
          room.items.push({ name: 'door', desc: 'It seems to go nowhere...', isOpen: false, use: ({disk, println, enterRoom}) => {
            const door = room.items.find(item => item.name === 'door');
            if (door.isOpen) {
              enterRoom('gameReallyOver');
            } else {
              println('The door is locked.');
            }
          }});
        }},
        { name: 'castle', desc: 'It has been... corrupted somehow.' },
      ]
    },
    {
      name: 'GAME REALLY OVER',
      id: 'gameReallyOver',
      img: '\¯\\\_(\ツ)\_/\¯',
      desc: `
        That's all I've written so far! If you liked this and want more, write me on Twitter: @okaybenji

        << ACKNOWLEDGMENTS >>

        OBCOM PCT-II designed by Adam Bing!
        Engine inspired in part by TextAdventure.js.
        Demo inspired by Forgotten by Sophia Park, Arielle Grimes, and Emilie Sovis.
        Ultimate Apple II Font from KreativeKorp.
        ASCII art adapted from ASCII Art Archive.
        TEXT-ENGINE logo made with Text to ASCII Art Generator.
        Sounds adapted from freesound.org.
      `,
    },
  ],
};
