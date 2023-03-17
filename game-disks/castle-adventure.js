// [This was generated by ChatGPT --ed]
const castleAdventure = () => ({
  roomId: 'courtyard',
  rooms: [
    {
      id: 'courtyard',
      name: 'Castle Courtyard',
      desc: 'You stand in a large, deserted courtyard. There are doors to the NORTH and WEST. Type ITEMS to see a list of items in the room.',
      items: [
        {
          name: 'door',
          desc: 'It leads NORTH.',
          onUse: () => println('The door is locked. You need a key to open it.'),
        },
        {
          name: 'key',
          desc: 'A rusted old key.',
          isTakeable: true,
          onUse: () => println('You unlock the door with the key and enter the castle.'),
        },
        {
          name: 'statue',
          desc: 'A stone statue of a knight, standing tall and proud.',
        },
      ],
      exits: [
        {
          dir: 'north',
          id: 'entrance',
          block: 'The door is locked. You need a key to open it.',
        },
        {
          dir: 'west',
          id: 'garden',
        },
      ],
    },
    {
      id: 'entrance',
      name: 'Castle Entrance',
      desc: 'You stand in a grand entrance hall. The room is dusty and cobwebbed. A staircase leads up to the east. There is a door to the SOUTH.',
      items: [
        {
          name: 'staircase',
          desc: 'A spiral staircase that leads up to the next level of the castle.',
          onUse: () => {
            setRoomId('tower');
            println('You climb the staircase and arrive at the tower.');
          },
        },
      ],
      exits: [
        {
          dir: 'south',
          id: 'courtyard',
        },
      ],
    },
    {
      id: 'garden',
      name: 'Castle Garden',
      desc: 'You stand in a lush garden full of exotic plants and flowers. There is a path leading to the NORTH and a gate to the EAST.',
      items: [
        {
          name: 'gate',
          desc: 'A rusty old gate. It looks like it has not been opened in years.',
          onUse: () => println('The gate is locked. You need a key to open it.'),
        },
      ],
      exits: [
        {
          dir: 'north',
          id: 'library',
        },
        {
          dir: 'east',
          id: 'courtyard',
          block: 'The gate is locked. You need a key to open it.',
        },
      ],
    },
    {
      id: 'library',
      name: 'Castle Library',
      desc: 'You stand in a large library filled with ancient books and manuscripts. There is a bookshelf to the WEST and a door to the SOUTH.',
      items: [
        {
          name: 'bookshelf',
          desc: 'A tall bookshelf filled with dusty old tomes.',
          onUse: () => println('You search the bookshelf but find nothing of interest.'),
        },
      ],
      exits: [
        {
          dir: 'south',
          id: 'garden',
        },
        {
          dir: 'west',
          id: 'secret',
          block: 'The bookshelf is blocking the way.',
        },
      ],
    },
    {
      id: 'secret',
      name: 'Secret Room',
      desc: 'You stand in a small, dusty room. There is a chest in the corner of the room.',
      items: []
    }
  ],
});
