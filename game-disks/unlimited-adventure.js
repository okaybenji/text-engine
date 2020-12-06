// customize the appearance of the bullets
bullet = '&ast;';

// customize the help menu
help = () => println(`LOOK :: repeat room description
LOOK AT [OBJECT NAME] e.g. 'look at key'
TAKE [OBJECT NAME] e.g. 'take book'
GO [DIRECTION] e.g. 'go north'
USE [OBJECT NAME] e.g. 'use door'
INV :: list inventory items
HELP :: this help menu`);

commands[0].help = help;

// switch to the retro style
document.getElementById('styles').setAttribute('href', 'styles/retro.css');

const unlimitedAdventure = {
  roomId: 'gameOver',        // The room the player is currently in. Set this to the room you want the player to start in.
  inventory: [],             // You can add any items you want the player to start with here.
  rooms: [
    {
      name: 'GAME OVER',     // This will be displayed each time the player enters the room.
      id: 'gameOver',        // The unique identifier for this room. Entering a room will set the disk's roomId to this.
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
        { dir: 'north', id: 'endOfTheWorld' }     // "dir" can be anything. If it's north, the player will type "go north" to get to the room called "endOfTheWorld".
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
        I don't know how you got here, but you definitely don't belong here. This is the End of the World. You already saved the k†ngdøm. It's time for you to leave.
      `,
      // This is just here as an example of how you can use the onEnter property.
      // This gets called when the player enters the room.
      onEnter: ({disk, println, getRoom}) => {
        console.log('Entered', disk.roomId); // Logs "Entered endOfTheWorld"
      },
      items: [
        { name: 'key', desc: 'It looks like a key.', isTakeable: true, use: ({disk, println, getRoom}) => {
          // This method gets run when the user types "use key".
          const room = getRoom(disk.roomId);
          const door = room.items.find(item => item.name === 'door');
          // If there's a door in the room, open it.
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
      img: '¯\\_(ツ)_/¯',
      desc: `
        That's all I've written so far! If you liked this and want more, write me on Twitter: @okaybenji
      `,
    },
  ],
};
