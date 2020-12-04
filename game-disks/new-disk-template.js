// This simple game disk can be used as a starting point to create a new adventure.
// Change anything you want, add new rooms, etc.
const newDiskTemplate = {
  roomId: 'start',
  rooms: [
    {
      id: 'start',
      name: 'The First Room',
      desc: `There's a door to the NORTH, but it is overgrown with VINES. Type ITEMS to see a list of items in the room.`,
      items: [
        {
          name: 'door',
          desc: 'It leads NORTH.',
          onUse: () => println(`Type GO NORTH to try the door.`),
        },
        {
          name: ['vines', 'vine'],
          desc: `They grew over the DOOR, blocking it from being opened.`,
        },
        {
          name: 'axe',
          desc: `You could probably USE it to cut the VINES, unblocking the door.`,
          isTakeable: true,
          onUse: () => {
            // Remove the block on the room.
            const firstRoom = getRoom('start');
            delete firstRoom.exits[0].block;
            
            println(`You cut through the vines, unblocking the door to the NORTH.`);
          },
        }
      ],
      exits: [
        {
          dir: 'north',
          id: 'clearing',
          block: `The DOOR leading NORTH is overgrown with VINES.`,
        },
      ],
    },
    {
      id: 'clearing',
      name: 'A Forest Clearing',
      desc: `It's a forest clearing. To the SOUTH is The First Room.`,
      exits: [
        {
          dir: 'south',
          id: 'start',
        },
      ],
    }
  ],
};
