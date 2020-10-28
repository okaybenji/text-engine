const urDead = {
  roomId: 'court',
  inventory: [
    {name: 'compass', desc: `You'd held onto it as a keepsake, even though in life the busted thing didn't work at all. Weirdly enough, it seems to work fine down here.`}
  ],
  rooms: [
    {
      name: 'Craggy Half-Court',
      id: 'court',
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
      onEnter: () => {
        const room = getRoom('court');

        if (room.visits === 1) {
          println(`The bad news is you are dead. The good news is, it's not so bad. Type LOOK to have a look around.`);

          room.desc = `You see a couple of skeletons playing HORSE. A gate leads NORTH.`;
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
          onTake: ({item}) => {
            const room = getRoom('court');
            room.desc = `You see a couple of skeletons. You get the feeling they don't care for you.`;
            println(`They don't look happy. (Later, you will confoundedly try to remember how you could TELL they looked uphappy.)`);
            item.desc = 'You could really have a ball with this thing.';
            item.use = () => println(`It's a bit hard to dribble on the uneven floor, but you manage to do so awkwardly.`);

            const skeletons = findCharacter('skeletons');
            skeletons.topics = () => ({ball: `Give us the ball.`});
          },
          use: ({println}) => println(`You'll have to take it first.`),
        }
      ],
      exits: [{dir: 'north', id: 'beach'}],
    },
    {
      name: 'The "Beach"',
      id: 'beach',
      desc: `There's a sign that reads "Death's a Beach." There's sand, to be sure, but there's no water in sight. And the sky is black.

To the NORTH you see a yaught in the sand, lit up like a Christmas tree. You hear the bassy thumping of dance music.

To the SOUTH is the gate to the half-court.

There's a bearded skeleton by the sign.`,
      items: [{name: 'sign', desc: `It says: DEATH'S A BEACH.`}],
      exits: [{dir: 'south', id: 'court'}],
    }
  ],
  characters: [
    {
      name: ['the skeletons', 'skeletons'],
      desc: [`They look competitive.`, `They're still on 'H'.`],
      roomId: 'court',
      topics: `They look pretty busy.`,
    },
  ],
};
