const gameDisk = {
  roomId: 'courtyard',
  rooms: [
    {
      id: 'courtyard',
      name: 'Courtyard',
      desc: 'You are standing in the courtyard of the castle. There is a fountain in the center of the courtyard.',
      items: [
        {
          id: 'key',
          name: 'key',
          desc: 'A shiny gold key.',
          onUse: () => {
            const courtyard = getRoom('courtyard');
            const entrance = getExit('north', courtyard.exits);
            delete entrance.block;
            println(`You unlock the door with the key.`);
            getItem('key').desc = 'You have already used the key.';
          },
        },
      ],
      exits: [
        { dir: 'north', id: 'castleEntrance', block: 'The castle entrance is locked. You need a key to unlock it.' },
      ],
    },
    {
      id: 'castleEntrance',
      name: 'Castle Entrance',
      desc: 'You are standing in the entrance of the castle. There is a grand staircase leading up to the second floor.',
      exits: [
        { dir: 'south', id: 'courtyard' },
        { dir: 'up', id: 'secondFloor' },
      ],
      items: [
        {
          name: 'staircase',
          desc: 'It is a spiral staircase leading up to the second floor of the castle.',
          onUse: () => {
            println('You climb up the spiral staircase to the second floor.');
            enterRoom('secondFloor');
          },
        },
      ],
    },
    {
      id: 'secondFloor',
      name: 'Second Floor',
      desc: 'You are standing on the second floor of the castle. There are two doors leading to different rooms.',
      items: [{ id: 'game', name: 'adventure game', desc: 'A disk with an adventure game on it.' }],
      exits: [
        { dir: 'down', id: 'castleEntrance' },
        { dir: 'east', id: 'secretRoom' },
        { dir: 'west', id: 'throneRoom' },
      ],
    },
    {
      id: 'throneRoom',
      name: 'Throne Room',
      desc: 'You are standing in the throne room. There is a throne in the center of the room, and two guards standing on either side of it.',
      items: [{ id: 'sword', name: 'sword', desc: 'A sharp, sturdy sword.' }],
      onEnter: () => println('"Halt!" one of the guards says. "No one may enter without the king\'s permission."'),
      exits: [
        { dir: 'east', id: 'secondFloor' },
      ],
    },
    {
      id: 'secretRoom',
      name: 'Secret Room',
      desc: 'You are in a secret room. There is a table with some items on it, and a character standing in the corner.',
      exits: [
        { dir: 'west', id: 'secondFloor' },
      ],
      items: [{ id: 'map', name: 'map', desc: 'A map of the castle.' }],
    },
  ],
  characters: [
    {
      name: ['wizard', 'Gandalf'],
      roomId: 'secretRoom',
      desc: 'An old wizard with a long beard and a staff.',
      topics: [
        {
          option: `Can you HELP me with this game disk?`,
          line: `"Ah, you've found my game disk," the wizard says. "I'm afraid I don't have much time to play games these days, but I can certainly help you with it. What do you need help with?"`,
          removeOnRead: true
        },
        {
          option: `How do I WIN the game?`,
          line: `"Well, I suppose that depends on the game," the wizard chuckles. "But typically, you'll need to solve puzzles, find items, and overcome obstacles to reach your goal. Good luck!"`,
          removeOnRead: true
        },
        {
          option: `Do you know any MAGIC?`,
          line: `"Of course I know magic," the wizard says. "I am a wizard, after all. But I'm afraid I can't just go around casting spells all willy-nilly. Magic is a powerful force, and it must be used responsibly."`,
          removeOnRead: true
        }
      ],
    },
  ],
};
