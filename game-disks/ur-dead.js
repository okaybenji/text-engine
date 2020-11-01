const urDead = {
  roomId: 'court',
  inventory: [
    {name: 'compass', desc: `You'd held onto it as a keepsake, even though in life the busted thing didn't work at all. Weirdly enough, it seems to function fine down here.`}
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
          onTake: ({item, room}) => {
            room.desc = `You see a couple of skeletons. You get the feeling they don't care for you.`;
            println(`One of the skeletons performs an elaborate dance to set up their shot, dribbling out a steady beat. They are clearly banking on the other forgetting one of the many the steps, and thus adding an 'O' to their 'H'. They're so swept up in their routine that you're able to step in and swipe the ball on a down beat.

            The skeletons don't look happy. (Later, you will confoundedly try to remember how you could TELL they looked uphappy.)`);
            item.desc = 'You could really have a ball with this thing.';
            item.use = () => println(`It's a bit hard to dribble on the uneven floor, but you manage to do so awkwardly.`);

            const skeletons = findCharacter('skeletons');

            skeletons.topics = [
              {
                option: 'Use the leverage to get INFO',
                cb: () => {
                  println(`You offer to return the ball if they'll just answer some questions. They beat you up and take the ball back.`);
                  disk.methods.resetCourt();
                },
              },
              {
                option: 'GIVE the ball back',
                cb: () => {
                  println(`Feeling a bit bad, you decide to return the ball and move on.`);
                  disk.methods.resetCourt();
                },
              },
            ];
          },
          use: () => println(`You'll have to take it first.`),
        }
      ],
      exits: [{dir: 'north', id: 'beach'}],
    },
    {
      name: 'The "Beach"',
      id: 'beach',
      desc: `There's a sign that reads DEATH'S A BEACH. There's sand, to be sure, but there's no water in sight. And the sky is a pitch-black void.

To the NORTH you see a yacht in the sand, lit up like a Christmas tree. You hear the bassy thumping of dance music.

To the SOUTH is the gate to the half-court.

There's a bearded skeleton by the sign. He seems to want to TALK.`,
      items: [
        {name: 'sign', desc: `It says: DEATH'S A BEACH.`},
        {name: 'yacht', desc: `You can't see it too clearly from here. You'll need to go further NORTH.`},
      ],
      exits: [{dir: 'south', id: 'court'}],
    }
  ],
  characters: [
    {
      name: ['the skeletons', 'skeletons'],
      desc: [`They look competitive.`, `They're still on 'H'.`],
      roomId: 'court',
      topics: `They look pretty busy.`,
      onTalk: () => println(`"Give it back," one of them says.`),
    },
    {
      name: 'bearded skeleton',
      desc: `He appears to have something to say. Or at least, he keeps clearing his throat. Or, that is, if he had a throat... This is a confusing place.`,
      roomId: 'beach',
      topics: [
        {
          keyword: 'how',
          option: `HOW did I get here?`,
          line: `"You're dead," he says in a scratchy voice, "You must've gathered that much."`,
          cb: () => {
            // replace this topic
            const skeleton = findCharacter('beard');
            const topic = skeleton.topics.find(t => t.keyword === 'how');
            topic.option = `HOW did I die?`;
            topic.line = `He half-smiles and says, "That, you'll find, is the million-dollar question."
            Mysterious.
            "Well, one of them."
            You don't know how you can tell he is smiling, but you CAN tell.`;
            topic.cb = () => {
              // remove this topic
              disk.methods.removeTopic('beard', 'how');
              // add another
              const skeleton = findCharacter('beard');
              skeleton.topics.push({
                keyword: 'back',
                option: `I don't want to die! How can I go BACK?`,
                line: `He looks grim. "Now, I wouldn't get your hopes up on that matter. Almost nobody pulls it off. But it is my duty to tell you anyhow."`,
                cb: () => {
                  disk.methods.removeTopic('beard', 'back');
                  const skeleton = findCharacter('beard');
                  skeleton.topics = skeleton.topics.concat([{
                    keyword: 'almost',
                    option: `ALMOST no one?`,
                    line: `"Well, yeah, there was Liam. Liam Hemsworth."`,
                    cb: () => disk.methods.removeTopic('beard', 'almost'),
                  }, {
                    keyword: 'how',
                    option: 'HOW then?',
                    line: `"To get out of here, and back up there," he points up, "you need two pieces of information. One, your NAME. And two, as you asked before, HOW you died."

                    It's at this moment that you realize you don't know your own name.

                    He continues, "And there's a reason you're not likely to find this information: who would you ask? After all, we're all in the same boat, up the same river."

                    He pauses to whistle a bar from COME SAIL AWAY.

                    "In other words, if I don't know so much as MY own name, how could I hope to tell you YOURS. You see?"

                    This talking, bearded skeleton is starting to make some sense.

                    "Anyway, I wouldn't worry too much about it. If you do happen across your NAME and CAUSE OF DEATH, come back here and I'll tell you where to go and who to talk to about it. But that's a whole other story, and as I said, it's not likely to come up! Just make yourself at home and start getting used to the place."
                    `,
                    cb: () => {
                      disk.methods.removeTopic('beard', 'how');
                      const skeleton = findCharacter('beard');
                      skeleton.topics.push({
                        keyword: 'home',
                        option: `HOME? But where is home?`,
                        line: `He smiles again, and holds out his hands as if to gesture: Everywhere.

                        "Have a look around. You can venture wherever strikes your fancy. No one frets much over privacy or personal space. No one will accuse you of trespassing. You don't need to eat or sleep. And no real harm can come to you! Just explore and enjoy yourself.

                        "Anyhow, I've said my spiel. I'll be here if you need me."

                        You thank him and end the conversation.
                        `,
                        cb: () => {
                          endConversation();
                          disk.methods.removeTopic('beard', 'home');

                          const skeleton = findCharacter('beard');
                          skeleton.topics.push({
                            keyword: 'what',
                            option: `WHAT was I supposed to be doing again?`,
                            line: `"If you're still trying to get out of here, come back once you've learned your NAME and HOW you died. Otherwise, just check things out and try to have a nice time."`,
                            cb: () => endConversation(),
                          });
                          skeleton.onTalk = () => {};
                          skeleton.desc = `I wonder how he attaches that beard...`;

                          // remove the last sentence of the description now that you've talked
                          const room = getRoom(disk.roomId);
                          room.desc = room.desc.replace(` He seems to want to TALK.`, '');
                        },
                      });
                    },
                  }]);
                },
              });
            };

            // add another topic
            skeleton.topics.push({
              keyword: 'skeleton',
              option: `Will I become a SKELETON, too?`,
              line: `"You already are one, as far as I can see!" he chuckles. "Down here, we can only see our own bodies. We all look like skeletons to one another. It's kind of nice, in a way. We don't have many beauty contests. Or anyway, our pageants don't hinge on natural good looks."`,
              cb: () => disk.methods.removeTopic('beard', 'skeleton'),
            });
          },
        },
      ],
      onTalk: () => println(`"I imagine," he begins, "you have some questions."`),
    },
  ],
  methods: {
    resetCourt: () => {
      const skeletons = findCharacter('skeletons');
      const ball = disk.inventory.find(i => i.name.includes('basketball'));
      const room = getRoom('court');
      skeletons.topics = 'They look pretty busy.';
      endConversation();

      // Put the ball back in the room.
      ball.use = () => println(`You'll have to take it first.`);
      room.items.push(ball);
      const itemIndex = disk.inventory.findIndex(i => i === ball);
      disk.inventory.splice(itemIndex, 1);
    },
    removeTopic(characterName, keyword) {
      const char = findCharacter(characterName);
      const index = char.topics.findIndex(t => t.keyword === keyword);
      char.topics.splice(index, 1);
    },
  },
};
