const urDead = {
  roomId: 'start',
  rooms: [
    {
      name: 'Afterlife',
      id: 'start',
      img: `
      .-.
     (o.o)
      |=|
     __|__
   //.=|=.\\\\
  // .=|=. \\\\
  \\\\ .=|=. //
   \\\\(_=_)//
    (:| |:)
     || ||
     () ()
     || ||
     || ||
    ==' '==
      `,
      onEnter: ({getRoom, println}) => {
        const room = getRoom('start');

        if (room.visits === 1) {
          println(`The bad news is you are dead. The good news is, it's not so bad. Type LOOK to have a look around.`);

          room.desc = `You see a couple of skeletons playing HORSE.`;
        }
      },
      items: [
        {
          name: 'hoop',
          desc: [`It's a hoot. [Not a typo. --ED]`],
        },
        {
          name: ['basketball', 'ball'],
          desc: 'You could really have a ball with that thing.',
          isTakeable: true,
          onTake: ({getRoom, println, item}) => {
            const room = getRoom('start');
            room.desc = `You see a couple of skeletons. You get the feeling they don't care for you.`;
            println(`They don't look happy. (Later, you will confoundedly try to remember how you could TELL they looked uphappy.)`);
            item.desc = 'You could really have a ball with this thing.';
            item.use = () => println(`It's a bit hard to dribble on the uneven floor, but you manage to do so awkwardly.`);
          },
          use: ({println}) => println(`You'll have to take it first.`),
        }
      ],
      exits: [{dir: 'down', id: 'purg'}],
    },
    {
      name: 'Purgatory',
      id: 'purg',
      exits: [{dir: 'up', id: 'start'}],
    }
  ],
  characters: [
    {name: ['the skeletons', 'skeletons'], desc: [`They look competitive.`, `They're still on 'H'.`], roomId: 'start'},
  ],
};
