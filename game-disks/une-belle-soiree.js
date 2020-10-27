// Mark the context (item) as examined.
const examine = function() {
  this.examined = true;
};

// Print room descriptions in order until they are exhausted (then repeats final description).
const getNextDescription = function(room) {
  if (this.examined) {
    return;
  }

  const nextDesc = room.descriptions.length ? room.descriptions.shift() : room.desc;
  println(nextDesc);

  if (!room.descriptions.length) {
    arrive({room});
  }
  
  room.desc = nextDesc;
};

// Move THIS (character) to an adjacent room along their route.
const updateLocation = function() {
  const reportEntrances = () => {
    const inRoom = getCharactersInRoom(disk.roomId);
    if (inRoom.map(r => r.name).includes(this.name)) {
      println(`${this.name} is here.`, false, false, true);
    }
  }

  const route = this.routes[this.currentRoute];

  if (!route || !route.path.length) {
    return;
  }

  if (route.path.length === 1) {
    this.roomId = route.path[0];
    reportEntrances();
    return this;
  }

  if (route.type == 'patrol') {
    if (route.path.findIndex(p => p === this.roomId) == route.path.length - 1){
      route.path.reverse();
      this.roomId = route.path[1];
      reportEntrances();
      return this;
    } else {
      this.roomId = route.path[route.path.findIndex(p => p === this.roomId) + 1];
      reportEntrances();
      return this;
    }
  }
  else if (route.type == 'loop') {
    this.roomId = route.path[(route.path.findIndex(p => p === this.roomId) + 1) % route.path.length];
    reportEntrances();
    return this;
  }
  else if (route.type == 'follow') {
    let path = BFS(disk.rooms, this.roomId, disk.roomId)
    if(path.length > 1){
      this.roomId = path[1].id;
      reportEntrances();
    }
  }
};

var adagio = document.getElementById("adagio");

// Determine the topics to return for a branching conversation.
const branchingConversationTopics = function() {
  const character = this;
  const findStepWithName = name => this.conversation.findIndex((step, i) =>
    step.name == name && i > character.stepIndex);
  let topics;

  while (character.stepIndex < character.conversation.length) {
    const step = character.conversation[character.stepIndex];

    if (step.line) {
      println(step.line);
      if (step.next) {
        character.stepIndex = findStepWithName(step.next);
      }
    } else if (step.question) {
      println(step.question);

      // Return the reponses as topics.
      topics = step.answers.reduce((acc, cur) => {
        acc[cur.next] = {
          response: cur.response,
          onSelected: function() {
            println(cur.line);
            character.stepIndex = findStepWithName(cur.next);
          },
        };
        return acc;
      }, {});
      break;
    }

    character.stepIndex++;

    if (step.callback) {
      step.callback();
    }
  }

  return topics || {};
};

// Handle the carriage arriving at its destination.
const arrive = ({room}) => {
  const fadeAudio = setInterval(function () {
    adagio.volume -= 0.05;
    if (adagio.volume <= 0.05) {
      clearInterval(fadeAudio);
    }
  }, 400);
  
  const door = {
    name: 'door',
    desc: `It's a door.`,
    use: () => {
      clearTimeout(room.openTimeout);
      println(`Uncharacteristically, you open the door rather than wait for assistance. As you exit the carriage, the servant, preoccupied with some tasks, looks to you with panic. "Pardon mademoiselle! I was coming just now to accomodate you. Please forgive my lateness. I was briefly kept by the coachman and had every intention of assisting you myself."`);
      adagio.volume = 1;
      adagio.currentTime = (6 * 60) + 25;
      setTimeout(() =>  enterRoom('gate'),4000);
    },
  };

  room.openTimeout = setTimeout(() => {
    println(`The servant opens the door.`),
    door.use = () => {
      adagio.volume = 1;
      adagio.currentTime = (6 * 60) + 25;
      setTimeout(() =>  enterRoom('gate'),4000);
    };
  }, 10000);

  room.items.push(door);
};

const uneBelleSoiree = {
  guilt: 2,
  inventory: [{
    name: ['hand-mirror', 'mirror'],
    desc: `You adjust your hair. Because of the boredom of provincial French life, what once felt like a duty has become a moment of excitement -- of diversion from your mother, your aunt, your brother. Rarely, the occasional businessmen visiting your father, none of whom you are given the opportunity to speak with. And strangely, in your excitement you also feel homesick and sad.`,
    getNextDescription,
    examine,
    look: function() {
      const room = getRoom('start');
      this.getNextDescription(room);
      this.examine();
    },
    use: function() {
      println(this.desc);
      const room = getRoom('start');
      this.getNextDescription(room);
      this.examine();
    },
  }, {
    name: 'ring',
    desc: `The ring was a gift from your father to your mother. You absentmindedly spin it on your finger and wonder, might you meet someone at the gathering? Someone who desires to adorn you with fine clothing and jewelry? Adornments you might lend your own daughters one day?`,
    getNextDescription,
    examine,
    look: function() {
      const room = getRoom('start');
      this.getNextDescription(room);
      this.desc = `It was a gift from your father to your mother.`;
      this.examine();
    },
  }],
  roomId: 'chapel',
  rooms: [
    {
      name: 'Carriage',
      id: 'start',
      img: ``,
      descriptions: [
        `Underneath the beating of the hooves, you can hear the cicadas and bullfrogs of summer. The smell of cut hay drifts into the coach. There is a hand-mirror in your pocket.`,
        `The irregular rhythms of the carriage over ruts in the country mud begin to turn to the even humming of paved roads. In the distance, the haze of harvest begins to be illuminated by the lights of a far off estate, which is just now becoming encircled with a light fog.`,
        `The light from the estate half-discloses the statuary that lines the entrance. From the roadside you hear the shouts of stablemen. Farther away, as quiet as a whisper, is a strange and exotic song.`,
        `The carriage comes to a stop. You can't make out the details, but the coachman is in some sort of conversation concerning the logistics of stabling the horses. Approaching the carriage is a servant of the House of Dauphin. You glance at the door.`,
      ],
      items: [{
        name: ['invitation', 'letter'],
        desc: `You'll have to pick it up. Try: TAKE INVITATION`,
        examined: false,
        isTakeable: true,
        examine,
        getNextDescription,
        onTake: function() {
          adagio.play();
          const room = getRoom('start');
          this.getNextDescription(room);
          this.desc = `In bold typeset and surrounded by Parisian filligree you read:

          Mlle. Cassat is requested to attend the ball at Chateau de Dauphin on Tuesday the 1st of June at 8'00 PM.
          `;

          this.look = function() {
            this.getNextDescription(room);
            this.examine();
          };
        },
      },
      ],
      onEnter: () => {
        const room = getRoom('start');

        if (room.visits === 1) {
          println(`WARNING: This game deals with very dark themes and includes graphic descriptions of violence.`);
          println(`You catch yourself as your head falls toward your shoulder. You always find the steady beat of hooves outside the carriage window to have a hypnotic effect. The invitation you held in your hand has fallen to the carriage floor.`);

          room.desc = `There is an invitation on the floor. Underneath the beating of the hooves, you can hear the cicadas and bullfrogs of summer.`;
        }
      },
    },
    {
      name: 'Gate', 
      id: 'gate', 
      desc:`A servant ushers you forward through the wrought iron gates that disappear into the hedge at both ends.
      The fog that seemed to envelop the estate while riding from the carriage appears as a light mist here.
      Long rays of light illuminate the wet stone pathway in front of you to the NORTH. Behind you the carriage drives on.`,
      exits: [
        { dir: ['north', 'in'], id: 'insideGate' }
      ],
      img:`
      ##::::'##:'##::: ##:'########::::'########::'########:'##:::::::'##:::::::'########:::::'######:::'#######::'####:'########::'########:'########:
      ##:::: ##: ###:: ##: ##.....::::: ##.... ##: ##.....:: ##::::::: ##::::::: ##.....:::::'##... ##:'##.... ##:. ##:: ##.... ##: ##.....:: ##.....::
      ##:::: ##: ####: ##: ##:::::::::: ##:::: ##: ##::::::: ##::::::: ##::::::: ##:::::::::: ##:::..:: ##:::: ##:: ##:: ##:::: ##: ##::::::: ##:::::::
      ##:::: ##: ## ## ##: ######:::::: ########:: ######::: ##::::::: ##::::::: ######::::::. ######:: ##:::: ##:: ##:: ########:: ######::: ######:::
      ##:::: ##: ##. ####: ##...::::::: ##.... ##: ##...:::: ##::::::: ##::::::: ##...::::::::..... ##: ##:::: ##:: ##:: ##.. ##::: ##...:::: ##...::::
      ##:::: ##: ##:. ###: ##:::::::::: ##:::: ##: ##::::::: ##::::::: ##::::::: ##::::::::::'##::: ##: ##:::: ##:: ##:: ##::. ##:: ##::::::: ##:::::::
     . #######:: ##::. ##: ########:::: ########:: ########: ########: ########: ########::::. ######::. #######::'####: ##:::. ##: ########: ########:
     :.......:::..::::..::........:::::........:::........::........::........::........::::::......::::.......:::....::..:::::..::........::........::`
    },
    {
      name: 'Inside Gate', 
      id: 'insideGate', 
      exits: [
        { dir: ['south', 'out'], id: 'gate' },
        { dir: 'north', id: 'fountain' }   
      ],
      onEnter() {
        this.desc = `${this.visits == 1 ? 'The servant escorts you through' : 'You are surrounded by' } two walls of well-kempt hedges. Atop each hedge are improbably shaped silhouettes of well-manicured topiaries. You can't make out their height as their tops are obscured by the mist and the night.`;
        println(this.desc);
      }
    },
    {
      name: 'Fountain',
      id: 'fountain', 
      exits: [
        { dir: 'south', id: 'insideGate' },
        { dir: 'north', id: 'outerCourt' },
        { dir: 'east', id: 'eastHedge' }, 
        { dir: 'west', id: 'westHedge' },
        // { dir: 'center', id: 'fountainCenter' },     
      ],
      items:[
        {name: ['dionysus','statue'], 'desc':'Frozen in a moment of orgiastic glee, balancing on the one foot of which he seems to be in control. Around his head is a bronze laurel, and oddly at his feet amid the crushed grapes, are pineapples and eucalytpus branches.'},
        {name: ['fountain','water'], 'desc':`The fountain is large enough that the center can not be reached except by wading through the waters.  It's too dark to see the bottom, but if it's like other fountains it is likely knee-deep at most.  The courtyard is filled with the thundering weight of the water falling from the statue's vase`},
        {name: ['vase'], 'desc':`Something is written on it, but it's too dark to see, looks like greek possibly?`},
      ],
      onEnter() {
        this.desc = `${this.visits == 1 ? 'The servant has recovered an air of formality, and is sinking back into a comfortable role and station. He smells heavily of hay and sweat.' : ''} Here, the foliage is trimmed into a rectangular courtyard. In the center of the courtyard is a large fountain -- a bronze dionysus pours water with revelry from a bacchanalian vase into the water below.`;
        println(this.desc);
      },
    },
    {
      name: 'Outer Court',
      id: 'outerCourt', 
      desc:[`Vines grow up the courtyard walls. To the NORTH, the windows of the house are well lit, each producing its own faint halo in the mist.`],
      items:[{name: ['vines', 'walls'], desc:`The vines seem uncharacteristically tenebrous. It looks like they may even have compromised the wall's structural integrity.`}],
      exits: [
        { dir: 'north', id: 'innerCourt' }, 
        { dir: 'south', id: 'fountain' }, 
      ]
    },
    {
      name: 'Inner Court',
      id: 'innerCourt', 
      desc:[`The courtyard is well illuminated. The marble stairs to the NORTH look as if they were recently constructed. The lawn is scattered with impressive gardens, and small ponds seem to be sourced from redirected streams somewhere else on the grounds.`],
      exits: [
        { dir: 'south', id: 'outerCourt' }, 
        { dir: 'north', id: 'grandPorch' }, 
      ]
    },
    {
      name: 'West Hedge',
      id: 'westHedge', 
      desc:[`It's difficult to see, but there seems to be a small stone statue in the southwest corner of this opening`],
      items:[
        {name: ['statue','farts', 'brigid'], desc: `Incense seems to have been recently burned here. A small cup of liquid and a cross lay at the saint’s feet. ‘Brigid Of Kildare’ is engraved on to the statue’s base. `},
        {
          name: ['cup','liquid','rum'], 
          desc: 'Some kind of alcohol, maybe?', 
          isTakeable:true, 
          use: function(){
            println('Rum. That was definitely some kind of strong rum.');
            disk.guilt++;
            let toBeRemovedIndex = this.items.findIndex(item => item.name[0] == 'cup');
            this.items = this.items.splice(toBeRemovedIndex,1);
          }
        },
        {name: ['cross'], desc: 'A cross carved from a dark wood. Looks like ebony.', isTakeable:true, onTake: () =>{
          // TODO
        }},
      ],
      
      exits: [
        { dir: 'east', id: 'fountain' }, 
      ]
    },
    {
      name: 'East Hedge',
      id: 'eastHedge', 
      desc:[`Too dark to see. The very top of the hedge is illuminated by a wedge of light coming from the house.`],
      exits: [
        { dir: 'west', id: 'fountain' }, 
      ]
    },
    {
      name: 'Grand Porch',
      id: 'grandPorch', 
      desc:[`The front of the Dauphin home is encircled by a large marble porch with ornate railing. In the moonlight, and from the relative height of the porch, you can see the entirety of the large moonlit lawn.`],
      items:[
      {name:'house', desc:`Your mother told you the GRANDFATHER DAUPHIN bought the house when she was a girl, but it was constructed several centuries ago and has changed ownership several times.`},
      {name:'lawn', desc:`It seems to have many small spaces partitioned by hedges, and networked with long pathway.`}
    ],
      exits: [
        { dir: 'south', id: 'innerCourt' }, 
        { dir: 'north', id: 'entry' },
        { dir: 'east', id: 'eastPorch' }, 
        { dir: 'west', id: 'westPorch' },  
      ]
    },
    {
      name: 'East Porch',
      id: 'eastPorch', 
      desc:[`From high on the porch, but near the east railing you can see, tucked behind the home and a row of columnar trees, is the practical workbuildings of the estate: sheds, coops, and a conspicuous greenhouse.`],
      items:[{'name':['coop','coops'], desc: `Very faintly from the coops you can hear an unusuaally loud clamor of a rooster. It's calls are muffled here, but it must be loud to be carrying this far`}],
      exits: [
        { dir: 'west', id: 'grandPorch' },  
      ]
    },
    {
      name: 'West Porch',
      id: 'westPorch', 
      desc:[`More of the same moonlit lawn heavily decorated with large patterns in the Hedges, in the distance you can see the lanterns of the stable hands as they tend to the riding equipment`],
      exits: [
        { dir: 'east', id: 'grandPorch' },  
      ]
    },
    {
      name: 'Entry',
      id: 'entry', 
      desc:[`Ornate mahogany panels surround the entrance to the home, the room seems impossibly tall. A large staircase leads up to a landing overlooking the entry room, and the grand salon.  Oil paintings adorn the walls in the room.`],
      items:[
        {name:['gallery','portraits','paintings'], desc:`Portraits of the Dauphins, some look to be more than a hundred years old. Broken occasionally by romaniticizations of provincial french landscape`},
        {name:['panels'], desc:`The panels seem to be made of the same wood as the similarly ornate moulding around the room. Father would have remarked unhappily at such a frivilous expense, were he here`},
      ],
      exits: [
        { dir: 'south', id: 'grandPorch' },  
        { dir: 'north', id: 'grandSalon' },  
        { dir: 'east', id: 'sittingRoom'},
        { dir: 'west', id: 'library'},
        { dir: 'up', id: 'landing'},  
      ]
    },
    {
      name: 'Grand Salon',
      id: 'grandSalon', 
      desc:[`A large circular room, the old salle de garde, now a salon. Elaborate embellishments on the ceiling border on onstentataious. The room is alive with chatter. A truly impressive spread of fruits, and game is available on the west side of the room.  A harpsichord is playing a minuet in the southwest corner.`],
      exits: [
        { dir: 'south', id: 'entry' },
        { dir: 'north', id: 'backLawn'},
        { dir: 'east', id: 'kitchen'},
        { dir: 'west', id: 'westhall'},
      ]
    },
    {
      name: 'Sitting Room',
      id: 'sittingRoom', 
      desc:[`Sofas are arrange to absorb heat from the sun during winter. `],
      items:[
        {name:['sofa'], desc:`Profusely decorated acanthus floral wood frames plush upholstery, somewhat faded from years in the sun`},
      ],
      exits: [
        { dir: 'west', id: 'entry'},
        { dir: 'north', id: 'kitchen'},
      ]
    },
    {
      name: 'Library',
      id: 'library', 
      desc:[`Bookshelves line the entirety of the room. The look well-kept, in fact many look untouched. The shelves in the northwest corner hold a number of large volumes with similar binding. You suspect from the width of the locked doors in the cabinetry that they house shelves of private information `],
      items:[
        {name:['law'], desc:`One section seems to be organized around law and legal theory. Loose folios of Montesquieu, are packed tightly on the lowest shelf. The rest seem to be analyses of various cases in maritime law, that Mr. Dauphin has had bound himself`},
        {name:['reference'], desc:`Atlases, encyclopedias, historical records.  Oddly many of the historical records are in Spanish, several histories, and short articles and a prominent tome by Bartolome De Las Casaas and another set of the correspondence of Nicolás de Ovando`},
        {name:['atlas'], desc:`You unshelf one of the Atlases out of curiousity, and thumb through. It's an atlas of the Americas. Largely focused on the Carribean, and Florida. A piece of paper covered in numbers, has apparently been used as a bookmark on an old record of Spanish Hispaniola.`},
        {name:['economy'], desc:`Some of the older untouched books appear to be about Flemish financial practices, newer tomes seem to be centered on the production, trade, and markets of indigo, tobacco, and sugar`},
      ],
      exits: [
        { dir: 'east', id: 'entry' }, 
        { dir: 'west', id: 'chapel'},
        { dir: 'north', id: 'westhall'},  
      ]
    },
    {
      name: 'Chapel',
      id: 'chapel', 
      desc:[`The southern side of the chapel has large stained glass windows, the moonlight barely illuminates the chapel, the front of the chapel is illuminated by a large candle stand, covered in lit votive candles. From their light you can see an almost-life-size wooden Christ gazing at the candles in perpetual agony.`],
      exits: [
        { dir: 'east', id: 'library' },  
      ]
    },
    {
      name: 'West Hall',
      id: 'westhall', 
      desc:[`A hall extending from the Grand Salon to the study, a door to the NORTH lead to a vestibulary `],
      exits: [
        { dir: 'south', id: 'library' },  
        { dir: 'east', id: 'grandSalon'}, 
        { dir: 'west', id: 'study' }, 
      ]
    },
    {
      name: 'Landing',
      id: 'landing', 
      desc:[`You get the feeling you aren't meant to be up here, but no one seems to notice you, from here you can see the guests in the grand salon conversing.`],
      exits: [
        { dir: 'down', id: 'Entry' }
      ]
    },
    {
      name: 'Study',
      id: 'study', 
      desc:[`A private study, it smell so strongly of tobacco it clearly doubles as a smoking room, a large wooden desk, is surrounded by exotic artifacts. `],
      exits: [
        { dir: 'east', id: 'westhall' }
      ]
    },
    {
      name: 'Kitchen',
      id: 'kitchen', 
      desc:[`The room is hot, and very uncomfortable, you worry that the floor will dirty your gown, everyone stops and looks up from their task. You feel very out of place.  Game is being carved on a large wooden table. Vegetables from the garden are being washed in a stone basin.`],
      onEnter: function() {
        this.desc = `The room is hot, and very uncomfortable.  Game is being carved on a large wooden table. Vegetables from the garden are being washed in a stone basin.`;
      },
      exits: [
        { dir: 'south', id: 'sittingRoom' },
        { dir: 'west', id: 'grandSalon' },
        { dir: 'east', id: 'garden'},
      ]
    },

  ],
  characters: [
    {
      name: ['Gaspard', 'servant'],
      desc: 'Servant of the Dauphin household, tasked with welcoming guests.',
      routes: {
        helpingGuests: {
          path: ['gate', 'insideGate', 'fountain', 'outerCourt', 'innerCourt'],
          type: 'patrol',
          },
        investigatingSound: {
          path: ['fountain', 'eastHedge', 'fountain', 'westHedge', 'innerCourt'],
          type: 'loop',
        }
      },
      updateLocation,
      currentRoute: 'helpingGuests',
      roomId: 'gate',
      topics: function({room}) {
        if(this.roomId === 'fountain'){
          return {fountain: 'This fountain was installed by Count Dauhphin, it is a recent addition.'};
        }

        if(this.currentRoute === 'helpingGuests'){
          return {escort: 'Right this way, madame.'};
        }
      }
    },
    {
      name: 'Richard',
      desc: 'The youngest of the Jeannin family, handsome and good-natured; but recently bethrothed to Miss Blackwood.',
      routes: {
        ariving: {
        path: ['innerCourt'],
          type: 'patrol',
        },
        walkingTheGrounds: {
          path: ['eastPorch', 'grandPorch', 'westPorch', 'innerCourt', 'outerCourt', 'fountain'],
            type: 'patrol',
          },
      },
      conversation: [
        {question: `“I'm sorry have we met?” Richard asks, before adding, “Ah, you must be from the Cassat family, yes?  Please send your father my warmest regards. I trust your mother and father are in good health?”`, answers: [
          {response: `Say YES`, next: 'yes'},
          {response: `ASK about Richard’s family`, next: 'ask'},
        ]},
        {name: 'yes', line: `“They are both of excellent health, thank you,” you reply.`, next: 'end'},
        {name: 'ask', question: `“They are,” you reply, “And yours as well I trust?”
        “My mother yes,” Richard says, “But unfortunately my father Edoard is quite sick.”`,
        answers: [
          {response: `ASK about father’s illness`, next: 'ask'},
          {response: `END the conversation`, next: 'end'},
        ]},
        {name: 'ask', line: `He seems uncomfortable discussing the topic. “Malaria, they say...”`},
        {name: 'end'},
        {line: `“Well I should join Miss Blackwood on her walk around the grounds,” he says with a bow. “I'm sure we will be speaking more this evening! A pleasure.”`},
      ],
      conversationType: 'branching',
      stepIndex: 0,
      updateLocation,
      currentRoute: 'arriving',
      roomId: 'innerCourt',
      topics: branchingConversationTopics,
    },
    {
      name: ['Grandfather Dauphin', 'Gramps'],
      desc: `The eldest Dauphin was once known for his cosmopolitan adventurism. At seventy-nine, he has become increasingly devout.

He is clutching a rosary near the front of the chapel. Sweat accumulates around his collar and drips from his brow. He is quietly muttering to himself, presumably praying.`,
      routes: {
        retire: {
          path: ['chapel', 'library', 'entry', 'landing'],
          type: 'patrol', // TODO: Add type where character ends at destination. Also, add a callback at the end of the route.
        },
      },
      roomId: 'chapel',
      conversation: [
        {
          question: `“Hail Mary, full of grace,
  the Lord is with thee.
  Blessed art thou amongst women,
  and blessed is the fruit of thy womb, Jesus.”`,
          answers: [
            {response: `INTERRUPT Grandfather Dauphin`, next: `interrupt`},
            {response: `LEAVE him be`, next: 'leave'},
          ]
        },
        {
          name: 'interrupt',
          question: `“The party’s in the salon,” he scowls. “You’re not meant to be here.”`,
          answers: [
            {response: `PRESS him`, next: 'press', line: `“Terribly sorry, Sir,” you reply. “I did not intend to eavesdrop on your communion... or penitance?”`},
            {response: `Just LEAVE`, next: 'leave'},
          ],
        },
        {
          name: 'press',
          question: `“Penitance?” he replies, anger in his voice. “Who exactly are you? And who invited you into my home?”`,
          answers: [
             {response: `IDENTIFY yourself`, next: 'identify', line: `“I am Emille Cassat,” you tell him with pride, “daughter of Count Chocula Cacky Cassat III. (D’uh.)”`},
             {response: `Just LEAVE`, next: 'leave'},
           ]
        },
        {
          name: 'identify',
          line: `At the sound of your family name, Dauphin unclenches his jaw. With a short, contemptuous laugh, he forcefully takes your wrist and thrusts his rosary into your palm.

          “You’ll be needing this far more than I.”
          `,
          callback() {
            const gramps = findCharacter('Grandfather Dauphin');
            gramps.currentRoute = 'retire';
            gramps.updateLocation();
            disk.inventory.push({
              name: 'rosary',
            });
            disk.guilt--;
          }
        },
        {
          name: 'leave',
          callback() {
            // Reset the conversation.
            const gramps = findCharacter('Grandfather Dauphin');
            gramps.stepIndex = 0;
          },
        },
      ],
      stepIndex: 0,
      conversationType: 'branching',
      topics: branchingConversationTopics,
      updateLocation,
    },
  ],
};

const adjMatrix = uneBelleSoiree.rooms.map( row => uneBelleSoiree.rooms.map(column => (row && row.exits && row.exits.map(r => r.id ).includes(column.id)) ? column.id : 0));

// 1 procedure BFS(G, root) is
// 2      let Q be a queue
// 3      label root as discovered
// 4      Q.enqueue(root)
// 5      while Q is not empty do
// 6          v := Q.dequeue()
// 7          if v is the goal then
// 8              return v
// 9          for all edges from v to w in G.adjacentEdges(v) do
// 10             if w is not labeled as discovered then
// 11                 label w as discovered
// 13                 Q.enqueue(w)

const BFS = (G, root, goal) => {
  const Q = [];
  const discovered = [];
  discovered.push(root);
  Q.push(G.find(element => element.id == root));
  while (Q.length > 0){
    const v = Object.assign({}, Q.pop());
    if (v.id === goal){
      const path = [];
      const getPath = (node) => {
        path.push(node);
        if (node.id == root) {
          return;
        }
        getPath(node.previous);
      }
      getPath(v);

      return path.reverse();
    }
    (v.exits || []).forEach(exit => {
      if (!discovered.find(elem => elem == exit.id)){
        const nextRoom = Object.assign({}, G.find(element => element.id == exit.id));
        nextRoom.previous = v;
        discovered.push(nextRoom.id);
        Q.push(nextRoom);
      }
    });
  }
};
