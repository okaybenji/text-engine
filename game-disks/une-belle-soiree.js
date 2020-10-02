const uneBelleSoiree = {
  roomId: 'start',
  rooms: [
    {
      name: 'Carriage [1779]',
      id: 'start',
      img: ``,
      items: [{
        name: ['invitation', 'letter'],
        desc: `You'll have to pick it up.`,
        isTakeable: true,
        onTake: ({getRoom, item}) => {
          const room = getRoom('start');
          room.desc = `Underneath the beating of the hooves, you can hear the cicadas and bullfrogs of summer.`;
          item.desc = `In bold typeset and surrounded by Parisian filligree you read:

          Mlle. Cassat is requested to attend the ball at Chateau de Francophilia on Tuesday the 1st of June at 8'00 PM.
          `;
          
          item.onLook = () => {
            room.desc = `The rhythms of the ruts in the country mud begin to turn to the hum of paved roads as in the distance the haze of harvest begins to be illuminated by the lights of a far off estate, which is just now becoming encircled with a light fog.`;
          };
        },
      }],
      onEnter: ({getRoom, println}) => {
        const room = getRoom('start');

        if (room.visits === 1) {
          println(`You catch yourself as your head falls toward your shoulder. You always find the steady beat of hooves outside the carriage window to have a hypnotic effect. The invitation you held in your hand has fallen to the carriage floor.`);

          room.desc = `There is an invitation on the floor. Underneath the beating of the hooves, you can hear the cicadas and bullfrogs of summer.`;
        }
      },
    },
  ],
};
