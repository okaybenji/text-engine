const gameDisk = {
  roomId: 'secretRoom',
  rooms: [
    {
      id: 'courtyard',
      name: 'Courtyard',
      desc: 'You are standing in the courtyard of the castle. There is a fountain in the center of the courtyard.',
      north: { roomId: 'castleEntrance', block: true },
      items: [{ id: 'key', name: 'key', desc: 'A shiny gold key.' }]
    },
    {
      id: 'castleEntrance',
      name: 'Castle Entrance',
      desc: 'You are standing in the entrance of the castle. There is a grand staircase leading up to the second floor.',
      south: { roomId: 'courtyard' },
      up: { roomId: 'secondFloor' }
    },
    {
      id: 'secondFloor',
      name: 'Second Floor',
      desc: 'You are standing on the second floor of the castle. There are two doors leading to different rooms.',
      down: { roomId: 'castleEntrance' },
      items: [{ id: 'game', name: 'adventure game', desc: 'A disk with an adventure game on it.' }],
      east: { roomId: 'secretRoom', block: true },
      west: { roomId: 'throneRoom' }
    },
    {
      id: 'throneRoom',
      name: 'Throne Room',
      desc: 'You are standing in the throne room. There is a throne in the center of the room, and two guards standing on either side of it.',
      east: { roomId: 'secondFloor' },
      items: [{ id: 'sword', name: 'sword', desc: 'A sharp, sturdy sword.' }],
      onEnter: () => console.log('"Halt!" one of the guards says. "No one may enter without the king\'s permission."')
    },
    {
      id: 'secretRoom',
      name: 'Secret Room',
      desc: 'You are in a secret room. There is a table with some items on it, and a character standing in the corner.',
      west: { roomId: 'secondFloor' },
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
