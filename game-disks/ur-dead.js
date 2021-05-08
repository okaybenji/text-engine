// NOTE: This game is a work in progress!

const urDead = {
  roomId: 'title',
  todo: [{id: 0, desc: `Figure out where you are.`}],
  inventory: [
    {name: 'compass', desc: `You'd held onto it as a keepsake, even though in life the busted thing didn't work at all. Weirdly enough, it seems to function fine down here.`},
    {
      name: ['to-do list', 'todo list'],
      desc: `The list contains the following to-do items:`,
      onLook: () => {
        // sort to-do list by done or not, then by id descending
        const list = disk.todo
          .sort((a, b) => {
            return (a.done && b.done) || (!a.done && !b.done) ? b.id - a.id
              : a.done ? 1
              : -1;
          })
          // cross off completed items
          .map(item => item.done ? `~~• ${item.desc}~~` : `• ${item.desc}`);

        list.forEach(println);
      },
      onUse: ({item, disk}) => {
        // Using the list is the same as looking at it.
        println(item.desc);
        item.onLook({disk});
      },
    },
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
          name: 'horse',
          desc: `Uh, no, it's a game. You can't look at it, but you can look at the SKELETONS playing it.`,
          isHidden: true,
        },
        {
          name: 'gate',
          desc: `If these are the gates of hell, this place was really oversold.`,
          onUse: () => enterRoom('beach')
        },
        {
          name: ['basketball', 'ball'],
          desc: 'You could really have a ball with that thing.',
          isTakeable: true,
          onTake: ({item, room}) => {
            const skeletons = getCharacter('dirk');
            skeletons.topics = skeletons.tookBallTopics;

            item.desc = 'You could really have a ball with this thing.';
            item.onUse = () => println(`It's a bit hard to dribble on the uneven floor, but you manage to do so awkwardly.`);

            if (skeletons.chatLog.includes('gotNames')) {
              // after you know their names
              room.desc = `Ronny and Dirk are still here playing HORSE.`;
              const activePlayer = Math.random() > 0.5 ? 'Ronny' : 'Dirk';
              println(`You swipe the ball again as ${activePlayer} dribbles up for a shot.`);
            } else {
              // when you take the ball before you know their names
              room.desc = `You see a couple of skeletons. You get the feeling they don't care for you.`;
              println(`One of the skeletons performs an elaborate dance to set up their shot, dribbling out a steady beat. They are clearly banking on the other forgetting one of the many the steps, and thus adding an 'O' to their 'H'. They're so swept up in their routine that you're able to step in and swipe the ball on a down beat.

              The skeletons don't look happy. (Later, you will confoundedly try to remember how you could TELL they looked uphappy.)`);

              item.onUse = () => println(`It's a bit hard to dribble on the uneven floor, but you manage to do so awkwardly.`);
            }
          },
          onUse: () => println(`You'll have to take it first.`),
        }
      ],
      exits: [{dir: 'north', id: 'beach'}, {dir: 'southwest', id: 'yard'}],
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
        {name: 'sand', desc: `Just regular old beach sand.`, block: `You try to take it, but it slips through your fingers.`},
        {name: 'no water', desc: `Didn't I say there wasn't any water?`},
        {name: ['void', 'sky'], desc: `I wonder if that's the soul-sucking void everyone's always talking about.`},
        {
          name: 'gate',
          desc: `It's the gate back to the half-court.`,
          onUse: () => enterRoom('court')
        },
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
        {name: ['glasses', 'sunglasses', 'shades', 'party', 'dj'], desc: `You'll need to use the ramp to get closer.`, isHidden: true},
        {name: 'yacht', desc: `It looks hard to spell.`},
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
      items: [
        {name: ['glasses', 'sunglasses', 'shades'], desc: `Oakley's? You have to wonder where this stuff comes from. Maybe there's an outlet mall around here.`, isHidden: true},
        {name: 'yacht', desc: `It looks hard to spell.`},
        {name: 'deck', desc: `It's... teak? I guess?`},
      ],
      exits: [{dir: 'south', id: 'ramp'}],
    },
    {
      name: '🎬 Blockbuster Parking Lot',
      id: 'parkingLot',
      desc: `Wow, I guess this is where businesses go when they die.`,
      items: [
        {
          name: ['Blockbuster', 'store'],
          desc: `The lights are off. It looks like there are hours posted on the DOOR.`,
        },
        {
          name: ['entrance', 'door'],
          desc: `The operating hours are posted, but the... times?.. are all written in arcane shapes you've never seen before.`,
          onUse: ({item}) => {
            const exit = getRoom('parkingLot').exits.find(exit => exit.id === 'blockbuster');
            if (exit.block) {
              println(`It's locked.`);
              return;
            }

            enterRoom('blockbuster');
          },
          locked: true,
          onLook: ({item}) => {
            const exit = getRoom('parkingLot').exits.find(exit => exit.id === 'blockbuster');

            if (!exit.block) {
              return;
            }

            println(`Suddenly the lights turn on. A clerk with a colorful mohawk opens the door, says "Come on in," and heads back inside without waiting for you to comply.`)

            delete exit.block;

            getItemInRoom('store', 'parkingLot').desc = `It's open for business. Let's make it a Blockbuster night.`;
          },
        },
        {
          name: 'parking lot',
          onLook: () => println(getRoom('parkingLot').desc),
        }
      ],
      onEnter() {
        const room = getRoom('parkingLot');
        room.desc = `It looks... exactly like a Blockbuster Video parking lot.`;
      },
      exits: [
        {dir: 'east', id: 'ramp'},
        {dir: ['north', 'in', 'inside'], id: 'blockbuster', block: `The door is locked.`},
      ],
    },
    {
      name: '🎬 Blockbuster Video',
      id: 'blockbuster',
      desc: 'Most of the shelves are empty. The clerk is watching *Mallrats*.',
      onLook() {
        const log = getCharacter('clerk').chatLog;
        if (!log.includes('sawMallrats')) {
          log.push('sawMallrats');
        }
      },
      items: [
        {name: ['shelf', 'shelves'], desc: `There are surprisingly few movie cases on the shelves. Actually, there are just three.`},
        {name: ['movies', 'cases'], desc: `The only titles they seem to have are *Toxic Avenger*, *The Bodyguard* and *Purple Rain*.`},
        {name: ['tv', 'mallrats'], desc: `Kevin Smith is dressed like Batman.`},
      ],
      exits: [
        {dir: ['south', 'out', 'outside'], id: 'parkingLot'},
      ],
    },
    {
      name: '⚓️ Front Yard',
      id: 'yard',
      onEnter () {
        const room = getRoom('yard');

        if (room.visits === 1) {
          getCharacter('dirk').chatLog.push('sawHouse');
        }

        // reset onCouch in case player is leaving the living room
        delete disk.onCouch;
      },
      desc: `You're in the yard of an unusual-looking one-story house. It's been painted to look like a boat. There's an anchor fixed to one side, a small sail attached to the chimney, and a balcony stretching out from the roof with a helm at the front, presumably there to prop up fantasies of steering the home about these parts.

      The front of the house has a WINDOW and a wooden DOOR. There's a elderberry TREE in the yard. A fence surrounds the sides and back.`,
      items: [
        {name: 'yard', isHidden: true},
        {name: 'house', desc: `It's painted white, with red and navy stripes wrapping it about two feet from the ground. It has a distinct maritime aura.`},
        {name: 'fence', desc: `A plain, wooden fence. It's too tall to see over, but peeking between the pickets you're pretty sure you see a normal back yard.`, isHidden: true},
        {name: 'elderberry tree', desc: `It's a mature tree. You'd need a ladder to reach the fruit.`},
        {name: ['fruit', 'elderberries'], desc: `All you can tell is that they're elderberries.`, isHidden: true},
        {name: 'anchor', desc: `With or without it, I don't think the house is going anywhere.`},
        {name: 'sail', desc: `It's chimney-sized.`, isHidden: true},
        {name: 'balcony', desc: `It's not clear from here how the balcony is accessed.`},
        {name: 'helm', desc: `It seems a bit strange for a house to have a steering wheel, but then again, you're new here.`, isHidden: true},
        {
          name: 'fake rock',
          desc: `It's really not very convincing. It's plastic and someone's stuck googly eyes to it with a hot glue gun.`,
          isHidden: true,
          onTake() {
            // if the player doesn't have the key and the door is locked, show a message
            if (!getItemInInventory('key') && getItemInRoom('door', 'yard').isLocked) {
              println(`There's no key under it, if that's what you're thinking. This is its home. Better leave it be.`);
            } else {
              println(`This is its home. Better leave it be.`);
            }
          },
        },
        {
          name: 'window',
          desc: `You can see the living room through the window. There's a couch and a tube TV with a VCR. It looks like there's a Blockbuster video case on the floor in front of the TV.`,
          onUse: () => println(`It appears to be inoperable. You'll have to use the door.`),
        },
        {name: ['couch', 'sofa', 'tv', 'television', 'tube', 'vcr', 'Blockbuster video case'] , desc: `You'll need to get inside for a better look.`, isHidden: true},
        {
          name: 'door',
          isLocked: true,
          desc: `The door looks pretty normal, aside from being attached to the odd house. There's a fake rock next to it.`,
          onUse({item}) {
            if (item.isLocked) {
              // if the player has the key, unlock the door and enter the room
              const key = getItemInInventory('key');
              if (key) {
                key.onUse();
              } else {
                println(`It's locked.`);
              }
            } else {
              enterRoom('livingRoom');
            }
          },
        },
      ],
      exits: [
        {dir: 'northeast', id: 'court'},
      ],
    },
    {
      name: `📺 Dirk & Ronny's Living Room`,
      id: 'livingRoom',
      desc: `You see Dirk & Ronny's COUCH, TV, and VCR, plus a Blockbuster video case on the floor.
      Further south appears to be a kitchen. Just before the kitchen to the southwest is a hallway.`,
      items: [
        {
          name: ['couch', 'sofa'],
          onUse() {
            println(`You plop down on the couch.`);
            disk.onCouch = true;
          },
          desc: `It doesn't look like much, but it's almost certainly the best spot in the house for watching movies.`,
          onLook() {
            if (disk.onCouch) {
              println(`You dig around a bit in the cushions. Amongst crumbs and hairs you find a 1965 Roosevelt dime.`);
              disk.inventory.push({
                name: 'dime',
                desc: `Wow, ten cents.`,
                // using the dime randomly prints HEADS or TAILS
                onUse: () => {
                  const side = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
                  println(`You flip the dime. It lands on ${side}.`);
                },
              });
            }
          },
        },
        {
          name: ['TV', 'television', 'tube'],
          desc: `It's a Zenith tube television with a dial and antenna.`,
        },
        {
          name: 'VCR',
          desc: `It's a Panasonic top-loading, programmable VCR with a digital clock.`,
          cassette: 'Romancing the Stone',
          onUse({item}) {
            // video strategy pattern
            const movies = {
              'Romancing the Stone': () => {
                println(`You hit PLAY and watch the cassette. You see trailers for *Rhinestone*, *Give My Regards to Broad Street*, and *Muppets Take Manhattan*, and finally, our feature presentation, *Romancing the Stone*. The movie is... fine.`);

                const videoCase = getItemInRoom('case', 'livingRoom');
                if (videoCase.wasSeen) {
                  println(`You comply with the case's instructions to BE KIND and REWIND.`);
                }

                // eject the video
                item.cassette = null;
                println(`You eject the video, put it in its case, and add it to your INVENTORY.`);
                disk.inventory.push({
                  name: [`*Romancing the Stone*`, 'video', 'vhs', 'tape'],
                  desc: `It's in a case with the Blockbuster logo, the name of the film, and a BE KIND, REWIND sticker.`,
                });

                // remove the video case from the room
                const room = getRoom('livingRoom');
                const caseIndex = room.items.findIndex(item => item === videoCase);
                room.items.splice(caseIndex, 1);
              },
              'Purple Rain': () => {
                // TODO!
              },
              'The Bodyguard': () => {
                // TODO!
              },
              'Toxic Avenger': () => {
                // TODO!
              },
            };

            if (movies[item.cassette]) {
              movies[item.cassette]();
            } else {
              println(`There's nothing in the VCR. You'll have to rent something from the local Blockbuster.`);
            }
          },
        },
        {
          name: 'Blockbuster video case',
          desc: `The case is empty. Looks like it once held *Romancing the Stone*. A sticker says BE KIND, REWIND.`,
          onLook() {
            const videoCase = getItemInRoom('case', 'livingRoom');
            videoCase.wasSeen = true;
          },
          onTake() {
            println(`Better find the movie first...`);
          },
        },
        {
          name: ['kitchen', 'hallway'],
          desc: `It's dark and you're not hungry.`,
          isHidden: true,
        },
      ],
      exits: [
        {dir: ['north', 'out', 'outside'], id: 'yard'},
        {dir: 'south', block: `It's dark and you're not hungry.`},
      ],
    },
  ],
  characters: [
    {
      name: ['the skeletons', 'skeletons', 'Ronny and Dirk'],
      desc: [`They look competitive.`, `They're still on 'H'.`],
      roomId: 'court',
      topics: `They look pretty busy.`,
      // these topics become available when you interrupt their game
      tookBallTopics: [
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

              // update conversation options
              getCharacter('clerk').chatLog.push('rons');
              skeletons.chatLog.push('gotNames');

              // update room description
              getRoom('court').desc = `Ronny and Dirk are still here playing HORSE.`;

              // make sure we only do this once!
              delete disk.askedSkeletonNames;
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
        {
          option: `Do you have a Blockbuster CARD?`,
          line: `"Nah, not anymore," he tells you with a little remorse. "We had one... but Dirk wouldn't let me return his video. He kept wanting to watch it again.
          "We ended up with so much in late fees we can't afford to go back. No clue where the card ended up."`,
          // this option only becomes available if you've gotten the skeletons to tell you their names
          prereqs: ['blockbuster', 'gotNames'],
          removeOnRead: true,
        },
        {
          option: `What was so GREAT about the movie?`,
          line: `"It's just a really solid film," he explains. "One of those you can watch over and over and you never get tired of it."`,
          prereqs: ['card'],
          removeOnRead: true,
        },
        {
          option: `Are you SURE it was really Dirk's fault you kept the movie?`,
          line: `"Oh, yeah," he says, eyes shifting, "Totally."`,
          prereqs: ['great'],
          removeOnRead: true,
        },
        {
          option: `That movie really does sound great. Any chance I could BORROW it?`,
          line: `"Woah, you haven't seen *Romancing the Stone*?" he asks, wide-eyed. "Oh, man, yeah, you need to watch it. We're sort of in the middle of something, but you can grab it from our pad over there," he says, nodding his head to the SOUTHWEST as Dirk tosses you a key.
          "You can leave it unlocked. Just slide the key under the fake rock."`,
          prereqs: ['great'],
          onSelected() {
            disk.inventory.push({
              name: 'key',
              desc: `It's not a skeleton key, but it is a skeleton's key. Dirk's, to be specific.`,
              onUse() {
                const door = getItemInRoom('door', 'yard');
                if (disk.roomId === 'yard') {
                  delete door.isLocked;
                  println(`You use Dirk's key to open the door, placing it under the fake rock before entering into the living room.`);
                  enterRoom('livingRoom');
                  // leave the door unlocked
                  getRoom('yard').exits.push({dir: ['south', 'in', 'inside'], id: 'livingRoom'});
                  // remove the key from inventory
                  const key = getItemInInventory('key');
                  const itemIndex = disk.inventory.findIndex(i => i === key);
                  disk.inventory.splice(itemIndex, 1);
                } else {
                  println(`This is the key to Ronny & Dirk's house. You have to go there to use it.`);
                }
              },
            });
          },
          removeOnRead: true,
        },
        {
          option: `Your HOUSE looks like a boat..?`,
          line: `"Yeah," he smiles bashfully, "We were kind of inspired by the yacht just NORTH from here.
          "To be honest, I think we've got it better than they do. After all, ours is a *real* house instead of a boat that *wants* to be a house. Plus, their yacht's not going anywhere, either."`,
          prereqs: ['borrow', 'sawHouse'],
          removeOnRead: true,
        },
      ],
      onTalk() {
        const gotNames = getCharacter('dirk').chatLog.includes('gotNames');
        println(`"Give it back," ${gotNames ? 'Ronny' : 'one of them'} says.`);
      },
    },
    {
      name: ['bearded skeleton', 'Dave'],
      desc: `He appears to have something to say. Or at least, he keeps clearing his throat. Or, that is, if he had a throat... This is a confusing place.`,
      roomId: 'beach',
      topics: [
        {
          option: `WHERE am I?`,
          line: `"This is the UNDERWORLD. Welcome!"`,
          removeOnRead: true,
          onSelected: () => disk.methods.crossOff(0),
        },
        {
          option: `How did I get HERE?`,
          line: `"You died," he says in a scratchy voice, "You must've gathered that much."`,
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

            disk.todo.push({id: 1, desc: `Find out your name.`});
            disk.todo.push({id: 2, desc: `Learn how you died.`});
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

            // update room description
            const room = getRoom('beach');
            room.desc = room.desc.replace(`There's a bearded skeleton by the sign`, `Dave, the bearded skeleton, stands by the sign`);
          },
        },
        {
          option: `Do you have a Blockbuster CARD?`,
          line: `"What's a blockbuster card?" he asks, showing no hints of humor or irony of any kind.`,
          prereqs: ['blockbuster'],
          removeOnRead: true,
        },
        {
          option: `Y'know, Blockbuster? The BUILDING right over there (point northwest)`,
          line: `"No, sorry," he smiles vaguely. "I pretty much just hang out right here on the beach. In case someone new shows up."`,
          prereqs: ['card'],
          removeOnRead: true,
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

        // update room description
        const room = getRoom('deck');
        room.desc = room.desc.replace(`A SKELETON IN A RED DRESS catches your eye`, `Fran is nearby`);
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
          line: `"Sure!" she says, digging a stack out of a hidden pocket in her dress. "You'll have to choose a name for yourself. What'll it be?"

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
        },
        {
          option: `Do you have a Blockbuster CARD?`,
          line: `"Why do you ask?" She seems to be thinking.`,
          prereqs: ['nametag', 'blockbuster'],
          removeOnRead: true,
        },
        {
          option: `I want to RENT a movie.`,
          line: `"You can have my card, but I don't know if it will help you," she explains, handing you the membership card.
          "The prior owner has racked up some hefty late fees. Apparently they never returned their copy of *Romancing the Stone*."`,
          prereqs: ['card'],
          onSelected() {
            disk.inventory.push({
              name: ['Blockbuster card', 'membership card'],
              desc: `The Blockbuster logo is on one side. The other side has a barcode.`,
              onUse: () => println(`You'll need to take it to Ron at the video store.`),
            });

            // remove the option to ask for a card
            getCharacter('clerk').chatLog.push('membership');
            // enable the option to present your card
            getCharacter('clerk').chatLog.push('gotCard');

            // check this off the to-do list
            disk.methods.crossOff(3);
          },
          removeOnRead: true,
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
    {
      name: ['Ron', 'clerk'],
      desc: `Their hair is a rainbow of pink, turquoise, and seafoam with incredible rigidity. Their nametag says "Ron". It's decorated with a smiley face sticker.`,
      roomId: 'blockbuster',
      topics: [
        {
          option: `Can I RENT a movie?`,
          line: `"Yeah, sure," they say, "If you have a membership card."`,
          removeOnRead: true,
          onSelected() {
            disk.todo.push({id: 3, desc: `Find a Blockbuster membership card.`})
            getCharacter('fran').chatLog.push('blockbuster');
            getCharacter('dave').chatLog.push('blockbuster');
            getCharacter('dirk').chatLog.push('blockbuster');
          },
        },
        {
          option: `Can I, uh, get a MEMBERSHIP card?`,
          line: `"Sorry," comes a quick reply, "printer's busted."`,
          prereqs: ['rent'],
          removeOnRead: true,
        },
        {
          option: `When is the printer going to be FIXED?`,
          line: `"It came that way, my dude," they tell you matter-of-factly. "It's always been busted, and it will always be busted. You basically either have a card or you don't."`,
          prereqs: ['membership'],
          removeOnRead: true,
        },
        {
          option: `I met a skeleton named RONNY at a b-ball court`,
          line: `"Oh, yeah, I'm Ron."
                  They don't seem to know what to do with this information.`,
          prereqs: ['rons'],
          removeOnRead: true,
        },
        {
          option: `I got a membership CARD`,
          line: `"Cool," they say, "What did you wanna rent?"`,
          prereqs: ['gotCard'],
          removeOnRead: true,
        },
        {
          option: `I want to rent *TOXIC Avenger*`,
          onSelected: () => disk.methods.checkCard(),
          prereqs: ['card'],
        },
        {
          option: `I want to rent *The BODYGUARD*`,
          onSelected: () => disk.methods.checkCard(),
          prereqs: ['card'],
        },
        {
          option: `I want to rent *PURPLE Rain*`,
          onSelected: () => disk.methods.checkCard(),
          prereqs: ['card'],
        },
        {
          option: `Can I rent MALLRATS?`,
          line: `"Nah," says Ron, "I'm watching that one."`,
          prereqs: ['card', 'sawMallrats'],
        },
        {
          option: `Can't you just WAIVE the late fee?`,
          line: `"Look, I don't know if you've noticed," they begin with a serious expression, "But our selection is a little lacking these days.
          "We don't get new movies in, so when a customer doesn't bring one back, that's one less film on the shelves.
          "All that to say, I'll be happy to waive your late fee — *if* you bring back *Romancing the Stone*."`,
          prereqs: ['fee'],
          onSelected() {
            disk.todo.push({id: 4, desc: `Return *Romancing the Stone*.`})
          },
        },
      ],
    },
  ],
  methods: {
    utils: {
      // saves text from memory to disk
      saveFile: (content, filename) => {
        const a = document.createElement('a');
        const file = new Blob([content], {type: 'text/plain'});

        a.href = URL.createObjectURL(file);
        a.download = filename;
        a.click();

        URL.revokeObjectURL(a.href);
      },
      // creates input element to open file prompt (allows user to load exported game from disk)
      openFile: () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.click();

        return input;
      },
      // asserts the command is not save, load, import or export, nor blank (could use a better name...)
      isNotMeta: (cmd) => !cmd.toLowerCase().startsWith('save')
        && !cmd.toLowerCase().startsWith('load')
        && !cmd.toLowerCase().startsWith('export')
        && !cmd.toLowerCase().startsWith('import')
        && cmd !== '',
      // applies string representing an array of input strings (used for loading saved games)
      applyInputs(string) {
        let ins = [];

        // parse, filtering out the save/load commands & empty strings
        try {
          ins = JSON.parse(string).filter(disk.methods.utils.isNotMeta);
        } catch(err) {
          println(`An error occurred. See error console for more details.`);
          console.error(`An error occurred while attempting to parse text-engine inputs.
            Inputs: ${string}
            Error: ${err}`);
          return;
        }

        while (ins.length) {
          applyInput(ins.shift());
        }
      },
    },
    commands: {
      // override help to include import/export
      help() {
        const instructions = `The following commands are available:
          LOOK:           'look at key'
          TAKE:           'take book'
          GO:             'go north'
          USE:            'use door'
          TALK:           'talk to mary'
          ITEMS:          list items in the room
          INV:            list inventory items
          SAVE/LOAD:      save current game, or load a saved game (in memory)
          IMPORT/EXPORT:  save current game, or load a saved game (on disk)
          HELP:   this help menu
        `;
        println(instructions);
      },
      // overridden save command stores player input history
      // (optionally accepts a name for the save)
      save: (name = 'save') => {
        localStorage.setItem(name, JSON.stringify(inputs));
        const line = name.length ? `Game saved as "${name}".` : `Game saved.`;
        println(line);
      },
      // overridden load command reapplies inputs from saved game
      // (optionally accepts a name for the save)
      load: (name = 'save') => {
        if (inputs.filter(disk.methods.utils.isNotMeta).length > 2) {
          println(`At present, you cannot load in the middle of the game. Please reload the browser, then run the **LOAD** command again.`);
          return;
        }

        let save = localStorage.getItem(name);

        if (!save) {
          println(`Save file not found.`);
          return;
        }

        disk.methods.utils.applyInputs(save);

        const line = name.length ? `Game "${name}" was loaded.` : `Game loaded.`;
        println(line);
      },
      // export current game to disk (optionally accepts a filename)
      export(name) {
        const filename = `${name.length ? name : 'urdead'}.txt`;
        disk.methods.utils.saveFile(JSON.stringify(inputs), filename);
        println(`Game exported to "${filename}".`);
      },
      // import a previously exported game from disk
      import() {
        if (inputs.filter(disk.methods.utils.isNotMeta).length > 2) {
          println(`At present, you cannot load in the middle of the game. Please reload the browser, then run the **IMPORT** command again.`);
          return;
        }

        const input = disk.methods.utils.openFile();
        input.onchange = () => {
          const fr = new FileReader();
          const file = input.files[0];

          // register file loaded callback
          fr.onload = () => {
            // load the game
            disk.methods.utils.applyInputs(fr.result);
            println(`Game "${file.name}" was loaded.`);
            input.remove();
          };

          // register error handling
          fr.onerror = (event) => {
            println(`An error occured loading ${file.name}. See console for more information.`);
            console.error(`Reader error: ${fr.error}
              Reader error event: ${event}`);
            input.remove();
          };

          // attempt to load the text from the selected file
          fr.readAsText(file);
        };
      },
      play: () => println(`You're already playing a game.`),
      // set player's name
      name: (arg) => {
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
      },
    },
    // cross an item off player's to-do list
    crossOff: (id) => {
      disk.todo.find(item => item.id === id).done = true;
    },
    // reset the state of the basketball court
    resetCourt: () => {
      const skeletons = getCharacter('dirk');
      skeletons.topics = `They look pretty busy.`;

      const ball = disk.inventory.find(i => i.name.includes('basketball'));
      const room = getRoom('court');
      endConversation();

      // Put the ball back in the room.
      ball.onUse = () => println(`You'll have to take it first.`);
      room.items.push(ball);
      const itemIndex = disk.inventory.findIndex(i => i === ball);
      disk.inventory.splice(itemIndex, 1);
    },
    // check the player's blockbuster membership card
    checkCard: () => {
      const numberWithCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      // late fees increase with each command; cents are randomized
      const fee = '$' + numberWithCommas(1000000 + (inputs.length * 99) + '.' + Math.random().toString().substring(2, 4));
      println(`Ron takes your membership card and scans the barcode on the back.
        "Looks like you've got ${fee} in late fees. I can't rent you a movie until that's paid."
      `);

      const log = getCharacter('clerk').chatLog;
      if (!log.includes('fee')) {
        log.push('fee');
      }
    },
  },
};

// override commands to include custom commands
commands[0] = Object.assign(commands[0], urDead.methods.commands);
commands[1] = Object.assign(commands[1], urDead.methods.commands);
commands[2] = Object.assign(commands[2], {play: urDead.methods.commands.play, name: urDead.methods.commands.name});
