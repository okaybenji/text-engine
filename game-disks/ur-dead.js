// NOTE: This game is a work in progress!

// override commands to include custom commands
// play command
const play = () => println(`You're already playing a game.`);

// set player's name
const name = (arg) => {
  if (!arg.length) {
    println(`Type NAME followed by the name you wish to choose.`);
    return;
  }

  disk.playerName = (Array.isArray(arg) ? arg.join(' ') : arg).toUpperCase();
  const nametag = disk.inventory.find(i => i.name === 'nametag');

  if (!nametag) {
    println(`You don't have a nametag.`);
    return;
  }

  nametag.desc = `It says ${disk.playerName}.`;

  // update Fran's greeting
  const fran = getCharacter('fran');
  fran.onTalk = () => println(`"Hello there, ${disk.playerName}."`);

  // confirm the change
  println(`Your name is now ${disk.playerName}.`);
};

commands[0] = Object.assign(commands[0], {play, name});
commands[1] = Object.assign(commands[1], {play, name});
commands[2] = Object.assign(commands[2], {play, name});

const urDead = {
  roomId: 'title',
  inventory: [
    {name: 'compass', desc: `You'd held onto it as a keepsake, even though in life the busted thing didn't work at all. Weirdly enough, it seems to function fine down here.`}
  ],
  rooms: [
    {
      id: 'title',
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
        println('ur dead', 'title');
        enterRoom('court');
      },
    },
    {
      name: '🏀 Craggy Half-Court',
      id: 'court',
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
            item.onUse = () => println(`It's a bit hard to dribble on the uneven floor, but you manage to do so awkwardly.`);

            const skeletons = getCharacter('ronny');

            skeletons.topics = [
              {
                option: 'Use the leverage to get INFO',
                onSelected: () => {
                  println(`You offer to return the ball if they'll just answer some questions. They beat you up and take the ball back.`);
                  disk.methods.resetCourt();
                },
              },
              {
                option: 'GIVE the ball back',
                onSelected: () => {
                  println(`Feeling a bit bad, you decide to return the ball and move on.`);
                  disk.methods.resetCourt();
                  if (disk.askedSkeletonNames) {
                    println(`"I'm Ronny," says the one on the left. "That's Dirk."

                    They resume their game.`);

                    // now that we know theirs name, let's call them by it
                    const skeletons = getCharacter('ronny');
                    skeletons.name = ['Ronny and Dirk', 'skeletons', 'the skeletons'];
                  }
                },
              },
              {
                option: 'Ask their NAMES',
                line: `"We might tell you," the one on the left says, "If you give us our ball back."`,
                prereqs: ['fran'],
                removeOnRead: true,
                onSelected: () => disk.askedSkeletonNames = true,
              },
            ];
          },
          onUse: () => println(`You'll have to take it first.`),
        }
      ],
      exits: [{dir: 'north', id: 'beach'}],
    },
    {
      name: '🏖 The "Beach"',
      id: 'beach',
      desc: `There's a sign that reads DEATH'S A BEACH. There's sand, to be sure, but there's no water in sight. And the sky is a pitch-black void.

To the NORTH you see a yacht in the sand, lit up like a Christmas tree. You hear the bassy thumping of dance music.

To the SOUTH is the gate to the half-court.

There's a bearded skeleton by the sign. He seems to want to TALK.`,
      items: [
        {name: 'sign', desc: `It says: DEATH'S A BEACH.`},
        {name: 'yacht', desc: `You can't see it too clearly from here. You'll need to go further NORTH.`},
      ],
      exits: [
        {dir: 'north', id: 'ramp'},
        {dir: 'south', id: 'court'},
      ],
    },
    {
      name: '🛥 Yacht Ramp',
      id: 'ramp',
      desc: `The music is louder here. A RAMP leads up to the yacht. Looks like there's a party on deck, and a skeletal DJ is spinning vinyl with shades on.

      To the SOUTH is the "beach".

      To the WEST, it looks like... a Blockbuster Video store?`,
      items: [
        {
          name: 'ramp',
          desc: `Nothing's stopping you from having a good time but you. Type USE RAMP.`,
          onUse: () => {
            enterRoom('deck');

            // add exit after player has learned the USE command
            const room = getRoom('ramp');
            room.exits.push({dir: 'north', id: 'deck'});
          },
        },
      ],
      exits: [
        {dir: 'south', id: 'beach'},
        {dir: 'west', id: 'parkingLot'},
      ],
    },
    {
      name: '🛥 Party On Deck',
      id: 'deck',
      desc: `Several skeletons are dancing and schmoozing. The DJ looks completely lost in the music. Everyone appears to be having a great time. A SKELETON IN A RED DRESS catches your eye.`,
      exits: [{dir: 'south', id: 'ramp'}],
    },
    {
      name: '🎬 Blockbuster Parking Lot',
      id: 'parkingLot',
      desc: `Wow, I guess this is where businesses go when they die.`,
      items: [
        {
          name: 'door',
          desc: `The operating hours are posted, but the... times?.. are all written in arcane shapes you've never seen before.`,
          onUse: () => println(`It's locked.`),
        },
        {
          name: ['Blockbuster', 'store'],
          desc: `The lights are off. It looks like there are hours posted on the DOOR.`,
        },
      ],
      onEnter() {
        const room = getRoom('parkingLot');
        room.desc = `It looks... exactly like a Blockbuster Video parking lot.`;
      },
      exits: [
        {dir: 'east', id: 'ramp'},
      ],
    },
  ],
  characters: [
    {
      name: ['the skeletons', 'skeletons', 'Ronny and Dirk'],
      desc: [`They look competitive.`, `They're still on 'H'.`],
      roomId: 'court',
      topics: `They look pretty busy.`,
      onTalk: () => println(`"Give it back," one of them says.`),
    },
    {
      name: ['bearded skeleton', 'Dave'],
      desc: `He appears to have something to say. Or at least, he keeps clearing his throat. Or, that is, if he had a throat... This is a confusing place.`,
      roomId: 'beach',
      topics: [
        {
          option: `How did I get HERE?`,
          line: `"You're dead," he says in a scratchy voice, "You must've gathered that much."`,
          removeOnRead: true,
        },
        {
          option: `How did I DIE?`,
          prereqs: ['here'],
          removeOnRead: true,
          line: `He half-smiles and says, "That, you'll find, is the million-dollar question."

            Mysterious.

            "Well, one of them."

            You don't know how you can tell he is smiling, but you CAN tell.`,
        },
        {
          option: `Will I become a SKELETON, too?`,
          prereqs: ['here'],
          removeOnRead: true,
          line: `"You already are one, as far as I can see!" he chuckles. "Down here, we can only see our own bodies. We all look like skeletons to one another. It's kind of nice, in a way. We don't have many beauty contests. Or anyway, our pageants don't hinge on natural good looks."`,
        },
        {
          option: `I don't want to die! How can I go BACK?`,
          prereqs: ['die'],
          removeOnRead: true,
          line: `He looks grim. "Now, I wouldn't get your hopes up on that matter. Almost nobody pulls it off. But it is my duty to tell you anyhow."`,
        },
        {
          option: `ALMOST no one?`,
          prereqs: ['back'],
          removeOnRead: true,
          line: `"Well, yeah, there was Liam. Liam Hemsworth."`,
        },
        {
          option: `HOW then?`,
          prereqs: ['back'],
          removeOnRead: true,
          line: `"To get out of here, and back up there," he points up, "you need two pieces of information. One, your NAME. And two, as you asked before, HOW you died."

          It's at this moment that you realize you don't know your own name.

          He continues, "And there's a reason you're not likely to find this information: who would you ask? After all, we're all in the same boat, up the same river."

          He pauses to whistle a bar from COME SAIL AWAY.

          "In other words, if I don't know so much as MY own name, how could I hope to tell you YOURS. You see?"

          This talking, bearded skeleton is starting to make some sense.

          "Anyway, I wouldn't worry too much about it. If you do happen across your NAME and CAUSE OF DEATH, come back here and I'll tell you where to go and who to talk to about it. But that's a whole other story, and as I said, it's not likely to come up! Just make yourself at home and start getting used to the place."`,
          onSelected() {
            // unlock asking Fran about her name
            const fran = getCharacter('fran');
            fran.chatLog.push('dave');
          },
        },
        {
          option: `HOME? But where is home?`,
          prereqs: ['how'],
          removeOnRead: true,
          line: `He smiles again, and holds out his hands as if to gesture: Everywhere.

          "Have a look around. You can venture wherever strikes your fancy. No one frets much over privacy or personal space. No one will accuse you of trespassing. You don't need to eat or sleep. And no real harm can come to you! Just explore and enjoy yourself.

          "Anyhow, I've said my spiel. I'll be here if you need me."

          You thank him and end the conversation.`,
          onSelected: () => {
            endConversation();

            const skeleton = getCharacter('dave');

            // remove "I'm sure you have questions" comment
            skeleton.onTalk = () => {};

            // replace "Looks like he wants to say something"
            skeleton.desc = () => `${disk.playerName ? disk.playerName + ', ' : ''} I wonder how he attaches that beard...`;

            // remove the last sentence of the description now that you've talked
            const room = getRoom(disk.roomId);
            room.desc = room.desc.replace(` He seems to want to TALK.`, '');
          },
        },
        {
          option: `WHAT was I supposed to be doing again?`,
          prereqs: ['home'],
          line: `"If you're still trying to get out of here, come back once you've learned your NAME and HOW you died. Otherwise, just check things out and try to have a nice time."`,
          onSelected: endConversation,
        },
        {
          option: `What is your NAME?`,
          prereqs: ['fran'],
          removeOnRead: true,
          line: () => `Oh, I'm Dave. Pleasure to make your acquaintance${disk.playerName ? ', ' + disk.playerName : ''}.`,
          onSelected: () => {
            // now that we know his name, let's call him by it
            const dave = getCharacter('dave');
            dave.name = ['Dave', 'bearded skeleton'];
          },
        },
      ],
      onTalk: () => println(`"I imagine," he begins, "you have some questions."`),
    },
    {
      name: ['skeleton in a red dress', 'Fran'],
      roomId: 'deck',
      desc: `She's wearing a nametag that says "Fran".`,
      onTalk: () => println(`"Hello there, stranger."`),
      onLook() {
        // now that we know her name, let's call her by it
        const fran = getCharacter('fran');
        fran.name = ['Fran', 'skeleton in a red dress'];

        // update her description
        fran.desc = `She has a warm presence. She's holding a nearly-empty piña colada and munching on the pineapple wedge.`;
      },
      topics: [
        {
          option: `WHO are you?`,
          line: `"I'm Fran. Didn't you see the nametag?"`,
          removeOnRead: true,
          onSelected: () => {
            // now that we know her name, let's call her by it
            const fran = getCharacter('fran');
            fran.name = ['Fran', 'skeleton in a red dress'];
          },
        },
        {
          option: `How did you find your NAME? How can I find mine?`,
          line: `She laughs. "Oh, honey, you must be new here," she says, "No one can remember their old names. We choose new names for ourselves."`,
          removeOnRead: true,
          prereqs: ['who', 'dave'],
          onSelected() {
            // unlock asking bearded skeleton and half-court skeletons about their names
            const dave = getCharacter('dave');
            dave.chatLog.push('fran');

            const skeletons = getCharacter('ronny');
            skeletons.chatLog.push('fran');
          },
        },
        {
          option: `Can I have a NAMETAG?`,
          line: `"Sure! You'll have to choose a name for yourself. What'll it be?"

          At any time, use the NAME command to update your NAMETAG.

          For instance: 'name Jane'
          `,
          prereqs: ['name'],
          removeOnRead: true,
          onSelected() {
            // add nametag to player inventory
            disk.inventory.push({
              name: 'nametag',
              desc: `It's blank. Choose a name by typing NAME followed by your name.`,
              onUse: () => println(`Use the NAME command to choose a name.`),
            });
          },
        }
      ],
    },
    {
      name: 'DJ',
      roomId: 'deck',
      desc: `Their future looks bright.`,
      topics: `They're lost in the music.`,
    },
    {
      name: ['the other skeletons', 'others', 'the skeletons', 'skeletons'],
      roomId: 'deck',
      desc: `They're having a wonderful time.`,
      topics: `They don't seem to notice you.`,
    },
  ],
  methods: {
    resetCourt: () => {
      const skeletons = getCharacter('ronny');
      const ball = disk.inventory.find(i => i.name.includes('basketball'));
      const room = getRoom('court');
      skeletons.topics = 'They look pretty busy.';
      endConversation();

      // Put the ball back in the room.
      ball.onUse = () => println(`You'll have to take it first.`);
      room.items.push(ball);
      const itemIndex = disk.inventory.findIndex(i => i === ball);
      disk.inventory.splice(itemIndex, 1);
    },
  },
};
