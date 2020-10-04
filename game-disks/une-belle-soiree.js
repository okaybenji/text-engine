const getNextDescription = ({room, println}) => { 
  let roomDesc = room.descriptions.length ? room.descriptions.shift() : room.desc;  
  println(roomDesc); 
  return roomDesc;
};

// Handle the carriage arriving at its destination.
const arrive = ({room, println, enterRoom}) => {
  const door = {
    name: 'door',
    desc: `It's a door.`,
    use: () => {
      clearTimeout(room.openTimeout);
      println(`Uncharacteristically, you open the door rather than wait for assistance. As you exit the carriage, the servant, preoccupied with some tasks, looks to you with panic. "Pardon mademoiselle! I was coming just now to accomodate you. Please forgive my lateness. I was briefly kept by the coachman and had every intention of assisting you myself."`);
      enterRoom('gate');
    },
  };

  room.openTimeout = setTimeout(() => {
    println(`The servant opens the door.`),
    door.use = ({enterRoom}) => {
      enterRoom('gate');
    };
  }, 10000);
  room.items.push(door);
};

const uneBelleSoiree = {
  inventory: [{
    name: ['hand-mirror', 'mirror'],
    desc: `You adjust your hair. Because of the boredom of provincial French life, what once felt like a duty has become a moment of excitement -- of diversion from your mother, your aunt, your brother. Rarely, the occasional businessmen visiting your father, none of whom you are given the opportunity to speak to. And strangely, in your excitement you also feel homesick and sad.`,
    look: ({getRoom, println, enterRoom}) => {
      const room = getRoom('start');
      room.desc = getNextDescription({room,println});
      if (!room.descriptions.length) {
        arrive({room, println, enterRoom});
      }
    },
    use: ({getRoom, println, item, enterRoom}) => {
      println(item.desc);
      const room = getRoom('start');
      room.desc = getNextDescription({room,println});
      if (!room.descriptions.length) {
        arrive({room, println, enterRoom});
      }
    },
  }, {
    name: 'ring',
    desc: `The ring was a gift from your father to your mother. You absentmindedly spin it on your finger and wonder, might you meet someone at the gathering? Someone who desires to adorn you with fine clothing and jewelry? Adornments you might lend your own daughters one day?`,
    look: ({getRoom, item, println, enterRoom}) => {
      const room = getRoom('start');
      room.desc = getNextDescription({room,println});
      if (!room.descriptions.length) {
        arrive({room, println, enterRoom});
      }
      item.desc = `It was a gift from your father to your mother.`;
    },
  }],
  roomId: 'gate',
  rooms: [
    {
      name: 'Carriage [1779]',
      id: 'start',
      img: ``,
      descriptions: [
        `Underneath the beating of the hooves, you can hear the cicadas and bullfrogs of summer. The smell of cut hay drifts into the coach. There is a hand-mirror in your pocket.`,
        `The rhythms of the carriage over ruts in the country mud begin to turn to the hum of paved roads as in the distance the haze of harvest begins to be illuminated by the lights of a far off estate, which is just now becoming encircled with a light fog.`,
        `The light from the estate half-discloses the statuary that lines the entrance. From the roadside you hear the shouts of stablemen. Farther away, as quiet as a whisper, is a strange and exotic song.`,
        `The carriage comes to a stop. You can't make out the details, but the coachman is in some sort of conversation concerning the logistics of stabling the horses. Approaching the carriage is a servant of the House of Dauphin. You glance at the door.`,
      ],
      items: [{
        name: ['invitation', 'letter'],
        desc: `You'll have to pick it up.`,
        isTakeable: true,
        onTake: ({getRoom, item, println, enterRoom}) => {
          const room = getRoom('start');
          room.desc = getNextDescription({room,println});
          if (!room.descriptions.length) {
            arrive({room, println, enterRoom});
          }
          item.desc = `In bold typeset and surrounded by Parisian filligree you read:

          Mlle. Cassat is requested to attend the ball at Chateau de Dauphin on Tuesday the 1st of June at 8'00 PM.
          `;

          item.look = () => {
            room.desc = getNextDescription({room,println});
            if (!room.descriptions.length) {
              arrive({room, println, enterRoom});
            }
          };
        },
      },
      ],
      onEnter: ({getRoom, println}) => {
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
        { dir: 'north', id: 'insideGate' }     
      ]
    },
    {
      name: 'Inside Gate', 
      id: 'insideGate', 
      exits: [
        { dir: 'south', id: 'gate' },   
        { dir: 'north', id: 'fountain' }   
      ],
      onEnter() {
        this.desc = `${this.visits < 1 ? 'The servant escorts you through' : 'You are surrounded by' } two walls of well kept hedges. Atop each heddge are improbably shaped silhouettes of well-manicured topiaries, you can't make out there height as there tops are obscured by the mist and the night`;
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
        // { dir: 'fountain center', id: 'fountainCenter' },     
      ],
      items:[
        {name: ['dionysus','statue'], 'desc':'Frozen in a moment of orgiastic glee, balancing on the one foot of which he seems to be in control. Around his head is a bronze laurel, and oddly at his feet amid the crushed grapes, are pineapples and eucalytpus branches'},
        {name: ['fountain','water'], 'desc':`The fountain is large enough that the center can not be reached except by wading through the waters.  It's too dark to see the bottom, but if it's like other fountains it is likely knee-deep at most.  The courtyard is filled with the thundering weight of the water falling from the statue's vase`},
        {name: ['vase'], 'desc':`Something is written on it, but it's too dark to see, looks like greek possibly?`},
      ],
      onEnter() {
        this.desc = `${this.visits < 1 ? 'The servant has recovered an air of formality, and is sinking back into a comfortable role and station. He smells heavily of hay and sweat.' : ''} Here the foliage is trimmed into a rectangular courtyard. In the center of the courtyard is a large fountain -- a bronze dionysus pours water with revelry from a bacchanalian vase into the water below`;
      },
    },
    {
      name: 'Outer Court',
      id: 'outerCourt', 
      desc:[`To the north the windows of the house are well lit; each producing it's own faint halo in the mist, vines grow up the courtyard walls.`],
      exits: [
        { dir: 'north', id: 'innerCourt' }, 
        { dir: 'south', id: 'fountain' }, 
      ]
    },
    {
      name: 'Inner Court',
      id: 'innerCourt', 
      desc:[``],
      exits: [
        { dir: 'south', id: 'outerCourt' }, 
      ]
    },
    {
      name: 'West Hedge',
      id: 'westHedge', 
      descriptions:[``],
      exits: [
        { dir: 'east', id: 'fountain' }, 
      ]
    },
    {
      name: 'East Hedge',
      id: 'eastHedge', 
      desc:[``],
      exits: [
        { dir: 'west', id: 'fountain' }, 
      ]
    },
  ],
};

let adjMatrix = uneBelleSoiree.rooms.map( row => uneBelleSoiree.rooms.map(column => (row && row.exits && row.exits.map(r => r.id ).includes(column.id)) ? column.id : 0));

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

function BFS(G,root,goal) {
  const Q = [];
  const discovered = [];
  discovered.push(root.id);
  Q.push( G.find(element => element.id == root));
  while (Q.length > 0){
    let v = Q.pop();
    if (v.id === goal){
      return v;
    }
    v.exits.forEach(exit => {
      if (!discovered.find(elem => elem == v.id)){
        console.log(G.find(element => element.id == exit.id), Q);
        discovered.push(G.find(element => element.id == exit.id).id);
        Q.push(G.find(element => element.id == exit.id));
      }
    });
  }
}

const updateLocation = function() {
  console.log('updateLocation', this);
  const route = this.routes[this.currentRoute];
  if (route.type == 'patrol') {
    if (route.path.findIndex(p => p === this.currentLocation) == route.path.length - 1){
      route.path.reverse();
      this.currentLocation = route.path[1];
      return this;
    } else {
      this.currentLocation = route.path[route.path.findIndex(p => p === this.currentLocation) + 1];
      return this;
    }
  }
  else if (route.type == 'loop') {
    this.currentLocation = route.path[(route.path.findIndex(p => p === this.currentLocation) + 1) % route.path.length];
    return this;
  }
};

const gaspard = {
  name: 'Gaspard',
  desc: 'Servant of the Dauphin household, tasked with welcoming guests',
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
  hasFartedd: true,
  sorryAboutThat: false,
  updateLocation,
  currentRoute: 'helpingGuests',
  currentLocation: 'gate',
  topics: function({println, room}) {
    const topics = {};
    if (this.hasFartedd){
      topics.thatfart = () => {
        this.hasFartedd = false;
        this.sorryAboutThat = true;
        return `You remind Gaspard that it is impolite to break wind in the presence of a lady.

        “Sorry about that,” he moans.`;
      };
    }
    if (room.id == 'fountain') {
      topics.apples = 'damn, I wish I was an apple';
    }
    if (this.sorryAboutThat) {
      topics.excuse = () => {
        this.sorryAboutThat = false;
        return `“That’s quite all right,” you say.

        Gaspard is visibly relieved. “Thank ya kindly miss, for excusin' ma fart.”`;
      };
    }
    return topics;
  }
};

const ghostgirl = {
  name: 'GhostGirl',
  desc: 'Servant of the Dauphin household, tasked with welcoming guests',
  routes: { 
    crying: {
//      path: ['eastHedge', 'fountain','westHedge'],
      path: ['gate'],
      type: 'patrol',
    },
  },
  conversation: [
    {line: `Hi!`},
    {line: `This is my new game.`},
    {question: `Do you like it?`, answers: [
      {response: `yes`, next: `yes`},
      {response: `no`, next: `no`},
    ]},
    {name: `yes`, line: `I am happy you like my game!`, next: `end`},
    {name: `no`, line: `You made me sad!`, next: `end`},
    {name: `end`},
    {line: `Okay, let's change the topic.`},
  ],
  stepIndex: 0,
  updateLocation,
  currentRoute: 'crying',
  currentLocation: 'eastHedge',
  topics: function({println}) {
    const character = this;
    const findStepWithName = name => this.conversation.findIndex(step => step.name == name);

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
        return step.answers.reduce((acc, cur) => {
          acc[cur.next] = function() {
            println(cur.line);
            character.stepIndex = findStepWithName(cur.next);
          }
          return acc;
        }, {});
        break;
      }

      character.stepIndex++;
    }

    // No topics remain.
    return {};
  }
};

const characters = [gaspard, ghostgirl];

function getCharactersInRoom(roomId) {
  return characters.filter(c => c.currentLocation === roomId);
}

// Debugging: Allow pressing > to force characters to move to adjacent rooms.
document.onkeypress = function (e) {
  if(e.keyCode == 62){
    characters.map(c=>c.updateLocation());
    console.log(characters.map(c => c.currentLocation))
  }
};
