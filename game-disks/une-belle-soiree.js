const getNextDescription = (room) => room.descriptions.length ? room.descriptions.shift() : room.desc;

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
      room.desc = getNextDescription(room);
      if (!room.descriptions.length) {
        arrive({room, println, enterRoom});
      }
    },
    use: ({getRoom, println, item, enterRoom}) => {
      println(item.desc);
      const room = getRoom('start');
      room.desc = getNextDescription(room);
      if (!room.descriptions.length) {
        arrive({room, println, enterRoom});
      }
    },
  }, {
    name: 'ring',
    desc: `The ring was a gift from your father to your mother. You absentmindedly spin it on your finger and wonder, might you meet someone at the gathering? Someone who desires to adorn you with fine clothing and jewelry? Adornments you might lend your own daughters one day?`,
    look: ({getRoom, item, println, enterRoom}) => {
      const room = getRoom('start');
      room.desc = getNextDescription(room);
      if (!room.descriptions.length) {
        arrive({room, println, enterRoom});
      }
      item.desc = `It was a gift from your father to your mother.`;
    },
  }],
  roomId: 'start',
  rooms: [
    {
      name: 'Carriage [1779]',
      id: 'start',
      img: ``,
      descriptions: [
        `Underneath the beating of the hooves, you can hear the cicadas and bullfrogs of summer. There is a hand-mirror in your pocket.`,
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
          room.desc = getNextDescription(room);
          if (!room.descriptions.length) {
            arrive({room, println, enterRoom});
          }
          item.desc = `In bold typeset and surrounded by Parisian filligree you read:

          Mlle. Cassat is requested to attend the ball at Chateau de Dauphin on Tuesday the 1st of June at 8'00 PM.
          `;

          item.look = () => {
            room.desc = getNextDescription(room);
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
    {name: 'Gate', id: 'gate'},
  ],
};
