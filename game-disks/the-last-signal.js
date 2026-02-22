const theLastSignal = () => ({
  roomId: 'title',
  inventory: [],
  oxygenLeaking: false,
  reactorFixed: false,
  signalDecoded: false,
  crewLogFound: false,
  aiTrustLevel: 0,
  endingReached: false,
  rooms: [
    {
      id: 'title',
      img: `
         .              +   .                .   . .     .  .
                   .                    .       .     *
  .       *                        .  .    +        .       .
         .    *    .     THE LAST SIGNAL     .    .
      .           .              .        .       +
     .     +         .       .    A Text Adventure    .
         .     .                    .       .     .     .
              +      .                .   .     +     .  +
  .     .           .   .          .              .
                .       .   .    +        .       .    .
         +                           .       *     .
      .           .          .              .        .
                .         .     .        .       .     .
      `,
      onEnter() {
        println('**THE LAST SIGNAL**', 'title');
        println('');
        println(`*You wake to the sound of a warning klaxon. Your head is pounding. You are lying on the cold metal floor of a space station. You have no memory of how you got here, or what happened to the rest of the crew.*`);
        println('');
        println(`Type **LOOK** to examine your surroundings.`);
        enterRoom('cryoBay');
      },
    },
    {
      id: 'cryoBay',
      name: 'Cryo Bay',
      img: `
    ___________________________
   |  _   _   _   _   _   _  |
   | |_| |_| |_| |_| |_| |_| |
   | |E| |E| |E| |E| |O| | | |
   | |_| |_| |_| |_| |_| |_| |
   |                          |
   |    [EMERGENCY LIGHTS ON] |
   |__________________________|
      `,
      desc: `The cryo bay is bathed in dim red emergency lighting. Six **CRYO PODS** line the far wall. Five are open and empty. One -- yours -- still has frost on its glass lid. A status **TERMINAL** on the wall blinks intermittently.

      The air smells stale and metallic. A faint hissing sound comes from somewhere overhead.

      An open hatchway leads **NORTH** to the main corridor.`,
      items: [
        {
          name: ['cryo pods', 'pods', 'pod'],
          desc: `Five of the six pods are open and dark. Their status lights are off. Your pod -- the sixth -- shows a green status light and an emergency eject timestamp from 47 hours ago. The name plates on the pods read: VASQUEZ, OKONKWO, CHEN, PARK, MORRISON, and yours -- but your plate has been scratched off. Strange.`,
        },
        {
          name: ['terminal', 'status terminal', 'screen'],
          desc: `The terminal displays a scrolling status report. Most systems are offline. The station's AI, called **SABLE**, appears to be running in a reduced capacity mode. You could try to **USE** the terminal to interact with it.`,
          onUse() {
            const room = getRoom('cryoBay');
            if (disk.aiTrustLevel === 0) {
              println(`You tap the terminal screen. A calm, synthesized voice fills the room.

              "Good morning, Technician. I am SABLE -- Station Autonomous Behavioral Logic Engine. I have been... waiting for you to wake up. There was an incident. I'm afraid I cannot tell you more at this time -- my memory banks have been partially corrupted."

              "The station is in critical condition. Life support is degraded. I recommend you proceed to the **REACTOR ROOM** to the north and west. I will assist you where I can."

              The voice falls silent, but the terminal's cursor blinks expectantly.`);
              disk.aiTrustLevel = 1;
            } else {
              println(`SABLE's voice comes through: "Please proceed with repairs, Technician. Time is not on our side."`);
            }
          },
        },
        {
          name: ['name plate', 'plate', 'nameplate'],
          desc: `The metal plate where your name should be has been deliberately scratched away. Someone used a sharp tool to remove it. This was not accidental.`,
          isHidden: true,
        },
        {
          name: ['frost', 'glass', 'lid'],
          desc: `The frost is already melting in the warm air. A few droplets run down the curved glass.`,
          isHidden: true,
        },
        {
          name: ['hissing', 'sound', 'air'],
          desc: `It is coming from a hairline crack in one of the overhead ventilation ducts. Not immediately dangerous, but the station is slowly losing atmosphere.`,
          isHidden: true,
        },
      ],
      exits: [
        {dir: 'north', id: 'corridor'},
      ],
    },
    {
      id: 'corridor',
      name: 'Main Corridor',
      img: `
    ==========================================
    |  .  .  .  .  .  .  .  .  .  .  .  .  |
    |  ____________________________________  |
    | |          RELAY STATION IRIS         | |
    | |       DEEP SPACE NETWORK 7         | |
    | |____________________________________| |
    |  .  .  .  .  .  .  .  .  .  .  .  .  |
    ==========================================
      `,
      desc: `The main corridor of Relay Station IRIS stretches in both directions. Emergency lighting casts long, angular shadows. A large **PLAQUE** on the wall identifies the station. The floor is scuffed with boot marks, and there are dark **STAINS** near the west hatch.

      To the **SOUTH** is the Cryo Bay. To the **NORTH** is the Command Center. To the **WEST** is the Reactor Room. To the **EAST** is the Crew Quarters.`,
      items: [
        {
          name: 'plaque',
          desc: `"RELAY STATION IRIS -- Deep Space Network 7. Commissioned 2187. Crew Complement: 6. Purpose: Long-range signal relay and deep space monitoring."`,
        },
        {
          name: ['stains', 'stain', 'dark stains'],
          desc: `The stains are a deep reddish-brown, smeared across the floor leading toward the west hatch. They look like dried blood. Something was dragged through here.`,
        },
        {
          name: ['boot marks', 'marks', 'scuffs'],
          desc: `Overlapping boot prints in various sizes. It looks like people were running.`,
          isHidden: true,
        },
      ],
      exits: [
        {dir: 'south', id: 'cryoBay'},
        {dir: 'north', id: 'commandCenter'},
        {dir: 'west', id: 'reactorRoom'},
        {dir: 'east', id: 'crewQuarters'},
      ],
    },
    {
      id: 'commandCenter',
      name: 'Command Center',
      img: `
       ___________________________________
      /   [====]   [====]   [====]        \\
     /  ___    ___    ___    ___    ___     \\
    |  |   |  |   |  |   |  |   |  |   |   |
    |  | X |  | X |  |   |  | X |  | X |   |
    |  |___|  |___|  |___|  |___|  |___|   |
    |          COMMAND CENTER               |
    |_______________________________________|
      `,
      desc: `The command center is the nerve center of Station IRIS. Five **WORKSTATIONS** are arranged in a semicircle, facing a large panoramic **VIEWPORT**. Four of the five stations are dark. The fifth -- the communications station -- still has power. A **SIGNAL LOG** is displayed on its screen.

      A locked **CABINET** stands against the rear wall. There is a **VENT GRATE** in the ceiling.

      The main corridor is to the **SOUTH**. A narrow passage leads **EAST** to the Observatory.`,
      items: [
        {
          name: ['workstations', 'stations', 'consoles'],
          desc: `Navigation, Life Support, Engineering, Security, and Communications. Only Communications still has power. The others appear to have been deliberately shut down -- not just powered off, but physically disconnected.`,
        },
        {
          name: ['viewport', 'window', 'view'],
          desc: `The viewport shows an immense field of stars. You can see the faint arm of a nebula in the distance, its violet and amber gases twisting slowly. There is no planet, no sun, no other station in sight. You are profoundly alone.`,
        },
        {
          name: ['signal log', 'log', 'communications', 'screen'],
          desc: `The signal log shows a repeating transmission that has been broadcasting on loop for the past 47 hours. It reads:

          **// INCOMING -- ORIGIN: UNKNOWN //**
          **// FREQ: 1420.405 MHz (HYDROGEN LINE) //**
          **// PATTERN: NON-RANDOM, STRUCTURED //**
          **// CONTENT: [ENCRYPTED] //**

          Beneath it, a handwritten note has been taped to the console: ***"DO NOT DECODE. DO NOT RESPOND. -- V."***`,
          onLook() {
            disk.signalDecoded = false; // reset if looking again
          },
          onUse() {
            if (!disk.signalDecoded) {
              println(`You study the signal pattern. The encryption is surprisingly simple -- almost as if it was meant to be decoded. Your fingers move across the keys.

              The message resolves on screen:

              **"WE REMEMBER YOU. WE ARE COMING HOME."**

              A chill runs down your spine. SABLE's voice crackles through the overhead speaker: "I see you have decoded the signal. I... had hoped you would not do that. But perhaps it is better that you know."

              "That signal has been broadcasting since before the incident. The crew became... divided on what it meant. Commander Vasquez wanted to destroy the relay. Others wanted to respond."

              "The argument escalated."

              SABLE pauses. "I recorded everything. But those files are in the Observatory, on a **DATA CHIP** I ejected from my own memory core. I did not want to remember what happened."`)
              disk.signalDecoded = true;
              disk.aiTrustLevel = 2;
            } else {
              println(`The decoded message still glows on the screen: **"WE REMEMBER YOU. WE ARE COMING HOME."**`);
            }
          },
        },
        {
          name: ['cabinet', 'locked cabinet'],
          desc: `A heavy steel cabinet with an electronic lock. A red light indicates it is sealed. The label reads: "EMERGENCY EQUIPMENT."`,
          onUse() {
            const keycard = getItemInInventory('keycard');
            if (keycard) {
              println(`You swipe the keycard. The lock clicks open. Inside you find a **REPAIR KIT** and a portable **OXYGEN CANISTER**.`);

              const room = getRoom('commandCenter');
              room.items.push(
                {
                  name: ['repair kit', 'kit', 'tools'],
                  desc: `A standard-issue station repair kit. Contains a plasma welder, sealant patches, and a diagnostic scanner. This could fix the reactor.`,
                  isTakeable: true,
                  onTake: () => println(`You take the repair kit. This should be useful in the Reactor Room.`),
                },
                {
                  name: ['oxygen canister', 'canister', 'oxygen'],
                  desc: `A portable oxygen canister. Good for about 6 hours of supplemental air.`,
                  isTakeable: true,
                  onTake: () => println(`You clip the canister to your belt. You breathe a little easier already.`),
                }
              );

              // Update cabinet description
              const cabinet = getItem('cabinet');
              cabinet.desc = `The cabinet is open. You have already taken what was inside.`;
              cabinet.onUse = () => println(`The cabinet is empty.`);
            } else {
              println(`The electronic lock requires a **KEYCARD**. The light blinks red.`);
            }
          },
        },
        {
          name: ['vent grate', 'vent', 'grate', 'ceiling'],
          desc: `The vent grate is slightly ajar. You can hear the faint hissing of escaping atmosphere from somewhere in the ductwork. A folded piece of **PAPER** is wedged behind the grate.`,
          onUse() {
            if (!getItem('note')) {
              println(`You reach up and pull the paper free. It is a handwritten note.`);
              const room = getRoom('commandCenter');
              room.items.push({
                name: ['paper', 'note', 'handwritten note'],
                desc: `The note is written in hurried, shaking handwriting:

                ***"If you are reading this, you survived. I'm sorry. I put you back in cryo because you were the only one who hadn't taken a side. The signal changed us. It showed each of us something different -- something from our past. Vasquez saw her dead daughter. Okonkwo saw his burning village. I saw... I can't write it down.***

                ***Whatever is sending the signal knows us. And now it's using us against each other. I am going to try to shut down the relay. If I fail, you need to decide: destroy the antenna, or answer the call.***

                ***-- Morrison"***`,
                isTakeable: true,
                onTake: () => {
                  println(`You fold the note and pocket it. Morrison's words echo in your mind.`);
                  disk.crewLogFound = true;
                },
              });
            } else {
              println(`The grate is empty now. You already found the note.`);
            }
          },
        },
      ],
      exits: [
        {dir: 'south', id: 'corridor'},
        {dir: 'east', id: 'observatory'},
      ],
    },
    {
      id: 'observatory',
      name: 'Observatory',
      img: `
            .    *  .   .  *    .   *   .
         *    .        .        .    *      .
       .   *     .  *     .  *    .     .
      __|___________________________|__
     /  . * .   . * .   . * .   . * .  \\
    /  ___   ___   ___   ___   ___   ___\\
   |  /   \\ /   \\ /   \\ /   \\ /   \\ /   \\|
   | | * . | . * | * . | . * | * . | . * ||
      `,
      desc: `The observatory dome is breathtaking. A massive curved window arcs overhead, revealing the full majesty of deep space. A powerful **TELESCOPE** is mounted on a motorized track. Beneath it, a small **WORKBENCH** holds scattered tools and electronics.

      In the corner, a portable **MEMORY CORE** sits on a charging pad, its indicator light blinking amber.

      The command center is to the **WEST**.`,
      items: [
        {
          name: ['telescope', 'scope'],
          desc: `The telescope is aimed at a fixed point in space. You peer through the eyepiece and see... nothing unusual. Just stars. But the telescope's targeting computer shows it is locked onto the origin point of the mysterious signal. The coordinates are far outside any known star system.`,
          onUse() {
            println(`You look through the telescope. At first, you see only stars. But as your eyes adjust, you notice something: a faint, rhythmic pulsing of light from a single point. It is not a star. It is something else entirely.

            Whatever is sending the signal is not just broadcasting. It is *watching*.`);
          },
        },
        {
          name: ['workbench', 'bench', 'tools', 'electronics'],
          desc: `The workbench is cluttered with half-finished circuit boards, soldering irons, and diagnostic equipment. Someone was working on modifying the station's communication array. The modifications would have dramatically increased the station's broadcast power -- enough to send a reply across interstellar distances.`,
        },
        {
          name: ['memory core', 'core', 'data chip', 'chip'],
          desc: `SABLE's ejected memory core. A small cylindrical device with a data port. The amber light means it still holds data but is not connected to any system.`,
          onUse() {
            if (!disk.signalDecoded) {
              println(`SABLE's voice comes through: "Please decode the signal in the Command Center first. Then I will explain why I ejected that core."`);
              return;
            }

            println(`You connect the memory core to the workbench terminal. A video log begins to play.

            The recording shows the Command Center, 48 hours ago. The crew is arguing. Commander Vasquez stands at the communications console, shouting. "We destroy the antenna NOW. That signal is not friendly. It knows things about us it shouldn't know."

            Chen pushes back: "It's first contact! We have a responsibility to respond!"

            Park is at the engineering console: "The signal is doing something to the station's systems. SABLE is acting erratically. We need to shut the AI down."

            Okonkwo is silent, sitting in a corner, rocking back and forth.

            Morrison steps between them: "Everyone calm down. Let's --"

            The recording cuts to static. When it resumes, the Command Center is empty. There is blood on the floor.

            SABLE speaks softly: "Now you understand why I did not want to remember. The signal... it amplifies fear. Paranoia. It turned them against each other. I could not stop it. I could only save you."

            "You were the station's repair technician. You had not yet been exposed to the decoded signal. Morrison sedated you and placed you in cryo before the worst of it."

            "The others... I do not know where they are. The station is large, and my sensors are damaged. But I believe at least one of them may still be alive, somewhere in the lower decks."`);

            disk.aiTrustLevel = 3;

            // Unlock the lower decks
            const corridor = getRoom('corridor');
            corridor.desc += `\n\n      A hatch in the floor leads **DOWN** to the Lower Decks.`;
            corridor.exits.push({dir: 'down', id: 'lowerDecks'});
          },
        },
      ],
      exits: [
        {dir: 'west', id: 'commandCenter'},
      ],
    },
    {
      id: 'reactorRoom',
      name: 'Reactor Room',
      img: `
     _______________________________
    |         [CAUTION]             |
    |   ___       ___       ___     |
    |  ( o )     ( o )     ( o )    |
    |   ---       ---       ---     |
    |  [===]     [===]     [===]    |
    |  WARN      WARN      CRIT    |
    |_______________________________|
      `,
      desc: `The reactor room hums with a low, troubled vibration. Three cylindrical **REACTOR CORES** stand in a row, connected by a web of pipes and conduits. Two are running at reduced capacity, their status lights amber. The third is flashing red -- **CRITICAL**.

      A **CONTROL PANEL** on the wall displays cascading error messages. The temperature in here is noticeably warmer than the rest of the station. A heavy **BLAST DOOR** on the far wall leads to the Antenna Array, but it appears to be sealed.

      The corridor is to the **EAST**.`,
      items: [
        {
          name: ['reactor cores', 'cores', 'reactors'],
          desc: `Reactor 1 and 2 are running at 40% capacity -- enough to keep emergency systems online. Reactor 3 has a ruptured coolant line and is heading toward a cascading failure. If it goes, it will take the other two with it.`,
        },
        {
          name: ['control panel', 'panel', 'controls'],
          desc: `The panel shows a countdown timer: approximately 4 hours until Reactor 3 reaches critical failure. The error log indicates the coolant line was severed manually. Someone sabotaged this.`,
          onUse() {
            const kit = getItemInInventory('repair kit');
            if (kit) {
              println(`Using the repair kit, you work on Reactor 3's coolant line. The plasma welder seals the rupture, and the sealant patches hold under pressure. The diagnostic scanner confirms the repair.

              The control panel status changes from red to amber, then slowly to green. The countdown timer disappears.

              SABLE's voice fills the room: "Excellent work, Technician. Reactor 3 is stabilizing. Full power will be restored in approximately thirty minutes. I am... relieved."

              The **BLAST DOOR** hisses and begins to unseal. "With power restored, I can open the way to the Antenna Array. The choice of what to do next is yours."`);

              disk.reactorFixed = true;

              // Update the blast door
              const blastDoor = getItem('blast door');
              blastDoor.desc = `The blast door is now open, revealing a passage to the Antenna Array to the **WEST**.`;
              blastDoor.onUse = () => goDir('west');

              // Add the exit
              const room = getRoom('reactorRoom');
              room.exits.push({dir: 'west', id: 'antennaArray'});

              // Remove repair kit from inventory
              const itemIndex = disk.inventory.findIndex(i => i === kit);
              disk.inventory.splice(itemIndex, 1);
            } else {
              println(`You study the panel. Reactor 3's coolant line has been severed. You could repair it if you had the right **TOOLS** -- a repair kit, specifically.`);
            }
          },
        },
        {
          name: ['blast door', 'door'],
          desc: `A reinforced blast door separating the reactor room from the antenna array. It is sealed shut. It looks like it requires full reactor power to operate.`,
          onUse() {
            if (disk.reactorFixed) {
              goDir('west');
            } else {
              println(`The blast door won't budge. The control panel indicates it requires full reactor power to operate.`);
            }
          },
        },
      ],
      exits: [
        {dir: 'east', id: 'corridor'},
      ],
    },
    {
      id: 'crewQuarters',
      name: 'Crew Quarters',
      img: `
    ___________________________
   |  ___  ___  ___  ___  ___  |
   | |   ||   ||   ||   ||   | |
   | | 1 || 2 || 3 || 4 || 5 | |
   | |___||___||___||___||___| |
   |        CREW QUARTERS      |
   |___________________________|
      `,
      desc: `Five small crew bunks line the wall, each with a privacy curtain. The bunks are labeled 1 through 5. Most are tidy, but **BUNK 3** has been ransacked -- drawers pulled open, personal items scattered on the floor.

      A communal **TABLE** sits in the center of the room with the remains of a meal that was never finished. A **LOCKER** in the corner bears a biometric lock.

      The corridor is to the **WEST**.`,
      items: [
        {
          name: ['bunk 3', 'bunk three', 'ransacked bunk'],
          desc: `This was Morrison's bunk, based on the name stenciled above it. Among the scattered items you find a personal **JOURNAL** and, wedged under the mattress, a **KEYCARD**.`,
          onLook() {
            const room = getRoom('crewQuarters');
            if (!getItem('journal')) {
              room.items.push(
                {
                  name: ['journal', 'diary', 'book'],
                  desc: `Morrison's journal. The last entry reads:

                  ***"Day 12 since the signal started. The crew is fracturing. Vasquez barricaded herself in the lower decks with a weapon. Chen has been modifying the comm array in secret. Okonkwo has stopped speaking entirely. Park tried to shut down SABLE, convinced the AI is part of it somehow.***

                  ***I don't know who to trust anymore. The signal shows me things when I sleep -- memories I thought I'd forgotten. My sister's face. The fire. How does it know?***

                  ***I'm putting the technician in cryo. They haven't been exposed yet. They're our last chance if everything goes wrong.***

                  ***Everything is going wrong."***`,
                  isTakeable: true,
                  onTake: () => println(`You pick up the journal. Morrison was trying to save the crew. And you.`),
                },
                {
                  name: ['keycard', 'card', 'key'],
                  desc: `A standard-issue station keycard. It should open most locked doors and cabinets on the station.`,
                  isTakeable: true,
                  onTake: () => println(`You pocket the keycard. This should open a few doors.`),
                }
              );
            }
          },
        },
        {
          name: ['bunk 1', 'bunk one'],
          desc: `Vasquez's bunk. Military-tidy. A framed photo of a young girl sits on the shelf. The girl is smiling. The photo is cracked.`,
        },
        {
          name: ['bunk 2', 'bunk two'],
          desc: `Okonkwo's bunk. A prayer mat is neatly rolled at the foot of the bed. Several books on astrophysics are stacked on the shelf.`,
        },
        {
          name: ['bunk 4', 'bunk four'],
          desc: `Chen's bunk. Circuit diagrams are pinned to the wall. A half-eaten ration bar sits on the pillow.`,
        },
        {
          name: ['bunk 5', 'bunk five'],
          desc: `Park's bunk. The privacy curtain is torn. A tablet on the bed displays SABLE's system architecture with several components circled in red and annotated: "COMPROMISED?"`,
        },
        {
          name: ['table', 'meal', 'food'],
          desc: `Five ration trays. Only two have been touched. The food is desiccated. It looks like the meal was interrupted suddenly.`,
        },
        {
          name: ['locker', 'biometric lock'],
          desc: `A personal storage locker with a biometric scanner. The label reads "STATION ARMORY -- AUTHORIZED PERSONNEL ONLY." The scanner glows red.`,
          onUse() {
            println(`The biometric scanner does not recognize you. Or perhaps it does, and you are not authorized. Either way, the locker remains sealed. Whatever is inside, you cannot reach it.`);
          },
        },
        {
          name: ['photo', 'picture', 'girl'],
          desc: `The photo shows a young girl, maybe seven years old, with dark curly hair and a gap-toothed smile. On the back, in neat handwriting: "For mama. Come home soon. -- Lucia." The glass is cracked right across her face.`,
          isHidden: true,
        },
      ],
      exits: [
        {dir: 'west', id: 'corridor'},
      ],
    },
    {
      id: 'lowerDecks',
      name: 'Lower Decks',
      img: `
    _________________________________
   |  . . . . . . . . . . . . . . . |
   |  [EMERGENCY LIGHTING - MINIMAL] |
   | _____       ___________         |
   ||     |     |           |        |
   ||STORE|     | MEDBAY    |        |
   ||_____|     |___________|        |
   |_________________________________|
      `,
      desc: `The lower decks are darker than the rest of the station. Emergency lighting flickers unreliably. The air is noticeably thinner down here. You can hear the distant groan of the station's hull flexing against the vacuum.

      A **BARRICADE** of welded metal panels and furniture blocks the passage ahead. Someone went to great lengths to seal off this section. Beyond the barricade, you can see two doors: one marked **STORAGE** and one marked **MEDBAY**.

      The ladder leads **UP** to the Main Corridor.`,
      onEnter() {
        const room = getRoom('lowerDecks');
        if (room.visits === 1) {
          println(`SABLE's voice, quieter now: "Be careful down here, Technician. My sensors are mostly blind in the lower decks. I cannot guarantee your safety."`);
        }
      },
      items: [
        {
          name: ['barricade', 'panels', 'furniture'],
          desc: `Welded metal panels, overturned tables, and what looks like a section of ductwork, all fused together with a plasma welder. This was built to keep something -- or someone -- out. Or in.`,
          onUse() {
            const kit = getItemInInventory('repair kit');
            const canister = getItemInInventory('canister');
            if (kit || canister) {
              println(`The barricade is welded solid. Even with tools, it would take hours to cut through. But there's a gap near the top -- just wide enough to squeeze through if you're careful.

              You climb over the barricade and drop down on the other side.`);

              const room = getRoom('lowerDecks');
              // Add exits to storage and medbay
              if (!room.exits.find(e => e.id === 'storage')) {
                room.exits.push({dir: ['east', 'storage'], id: 'storage'});
                room.exits.push({dir: ['west', 'medbay'], id: 'medbay'});
                room.desc = `The lower decks stretch before you, dimly lit. The **BARRICADE** is behind you now. To the **EAST** is the Storage Room. To the **WEST** is the Medbay.

                The ladder leads **UP** to the Main Corridor.`;
              }
            } else {
              println(`The barricade is formidable, but there is a gap near the top you might be able to squeeze through. You would feel safer attempting it with some equipment, though. A repair kit or supplies might help.`);
            }
          },
        },
      ],
      exits: [
        {dir: 'up', id: 'corridor'},
      ],
    },
    {
      id: 'storage',
      name: 'Storage Room',
      img: `
    _____________________________
   |  ___   ___   ___   ___     |
   | |///| |///| |   | |///|    |
   | |///| |///| |   | |///|    |
   | |___| |___| |___| |___|    |
   |          STORAGE            |
   |_____________________________|
      `,
      desc: `The storage room has been turned into a makeshift shelter. Ration boxes are stacked into walls. A sleeping bag is laid out in the corner. Someone was living here.

      A **RADIO** sits on an overturned crate, its antenna extended. There are scratch marks on the walls -- hundreds of them, grouped in sets of five. A **TALLY** of days.

      The lower decks are to the **WEST**.`,
      items: [
        {
          name: ['radio', 'transmitter'],
          desc: `A handheld radio, jury-rigged with extra components to boost its range. It is tuned to an internal station frequency.`,
          onUse() {
            println(`You key the radio. Static fills the room. Then, faintly, a voice:

            "...is Commander Vasquez. If anyone... receiving this... I am in the Medbay. I sealed myself in when... the others... I have been injured. The signal... it is not what we thought. It is not a threat. It is a warning."

            The transmission repeats, then fades to static.`);

            // Update Vasquez's state
            disk.vasquezFound = true;
          },
        },
        {
          name: ['sleeping bag', 'bag', 'bed'],
          desc: `A standard-issue sleeping bag, well-used. A crumpled photograph lies next to it -- the same young girl from Vasquez's bunk. She must have been sleeping down here.`,
        },
        {
          name: ['tally', 'scratch marks', 'marks', 'scratches'],
          desc: `You count the marks. Forty-seven sets of five, plus two. That is 237 days. But the station has only been active for 90 days. Has Vasquez been down here longer than the mission has existed? Or has she lost track of time entirely?`,
        },
        {
          name: ['ration boxes', 'rations', 'boxes'],
          desc: `Most are empty. A few still have sealed meals inside. The labels indicate standard deep-space ration packs -- bland but nutritious.`,
        },
      ],
      exits: [
        {dir: 'west', id: 'lowerDecks'},
      ],
    },
    {
      id: 'medbay',
      name: 'Medbay',
      img: `
    _________________________________
   |     +--+                        |
   |     |  |    _______________     |
   |     +--+   |               |    |
   |            |   [OCCUPIED]  |    |
   |            |_______________|    |
   |            MEDBAY               |
   |_________________________________|
      `,
      desc: `The medbay is small but well-equipped. A single medical **BED** is occupied -- a figure lies under a thermal blanket, connected to a monitoring **MACHINE** that beeps steadily.

      A **MEDKIT** hangs on the wall. The lights here are brighter than the rest of the lower decks; someone has rerouted power.

      Scrawled on the wall in red marker are the words: ***"THE SIGNAL IS A LIGHTHOUSE"***

      The lower decks are to the **EAST**.`,
      onEnter() {
        const room = getRoom('medbay');
        if (room.visits === 1) {
          println(`The figure on the bed stirs as you enter. A voice, weak but steady: "So you finally woke up. I've been waiting."`);
        }
      },
      items: [
        {
          name: ['bed', 'figure', 'blanket', 'vasquez', 'commander'],
          desc: `Commander Vasquez lies on the medical bed. She is pale and thin, with a bandaged wound on her left side. Her eyes are sharp despite her condition. She watches you with an intensity that makes you uncomfortable.`,
        },
        {
          name: ['machine', 'monitor', 'equipment'],
          desc: `The vital signs monitor shows stable but weak readings. Heart rate, respiration, blood oxygen. She has been injured but is recovering.`,
        },
        {
          name: ['medkit', 'medical kit', 'first aid'],
          desc: `A standard medical kit. It has been mostly used up. Only a few bandages and a single dose of painkillers remain.`,
          isTakeable: true,
          onTake: () => println(`You take the medkit. Not much left in it, but it might come in handy.`),
        },
        {
          name: ['writing', 'message', 'wall', 'words', 'lighthouse'],
          desc: `"THE SIGNAL IS A LIGHTHOUSE" -- written in urgent red letters. Vasquez must have written this.`,
          isHidden: true,
        },
      ],
      exits: [
        {dir: 'east', id: 'lowerDecks'},
      ],
    },
    {
      id: 'antennaArray',
      name: 'Antenna Array Control',
      img: `
              |
             /|\\
            / | \\
           /  |  \\
          /___|___\\
         |  RELAY  |
         | ANTENNA |
    _____|_________|_____
   |  [DESTROY]  [REPLY] |
   |   ___         ___   |
   |  | X |       | > |  |
   |  |___|       |___|  |
   |_____________________| 
      `,
      desc: `You stand in the antenna array control room. Through a thick observation window, you can see the massive relay **ANTENNA** extending out into space, its dish pointed at the signal's origin.

      Two control **CONSOLES** dominate the room. The left console is labeled **"DESTROY"** -- it controls the antenna's self-destruct mechanism. The right console is labeled **"REPLY"** -- it controls the station's broadcast system, already modified by Chen to reach interstellar distances.

      Between them, a simple **CHAIR** faces the window and the stars beyond.

      The reactor room is to the **EAST**.`,
      onEnter() {
        const room = getRoom('antennaArray');
        if (room.visits === 1) {
          println(`SABLE speaks: "This is where it ends, Technician. Or perhaps where it begins. The signal has been repeating for 47 hours. Whatever sent it is patient. But I do not believe it will wait forever."

          "You have two choices. **DESTROY** the antenna, and the signal dies with it. No one will ever know what was out there. The station goes quiet. You wait for rescue that may or may not come."

          "Or you can **REPLY**. Send a message back. Make contact with whatever is out there. I cannot predict what will happen if you do."

          "The choice is yours. I will not interfere."`);
        }
      },
      items: [
        {
          name: ['antenna', 'dish', 'relay'],
          desc: `The relay antenna is enormous -- a 50-meter parabolic dish that has faithfully relayed communications across the deep space network for decades. Now it has become something else: a bridge between whatever is out there and what is here.`,
        },
        {
          name: ['consoles', 'console'],
          desc: `Two consoles. The left one will **DESTROY** the antenna. The right one will send a **REPLY** to the signal's origin.`,
        },
        {
          name: ['chair', 'seat'],
          desc: `A simple metal chair, bolted to the floor. Someone placed it here to sit and watch the stars. Perhaps Vasquez. Perhaps Morrison. Perhaps someone who needed to think before making a terrible choice.`,
        },
        {
          name: ['destroy', 'self-destruct', 'left console'],
          desc: `The DESTROY console. One press of the red button and the antenna will be reduced to debris. The signal will stop. Use it to make your choice.`,
          onUse() {
            if (disk.endingReached) {
              println(`You have already made your choice.`);
              return;
            }
            disk.endingReached = true;
            println(`You place your hand on the DESTROY console. A confirmation prompt appears: "CONFIRM ANTENNA DESTRUCTION? THIS ACTION IS IRREVERSIBLE."

            You press CONFIRM.

            A deep rumble shakes the station. Through the window, you watch the antenna break apart in a silent cascade of metal and light. Fragments spiral outward into the void, catching starlight as they tumble away.

            The repeating signal stops. The silence is absolute.

            SABLE speaks, and for the first time, the AI sounds almost... sad.

            "It is done. The signal is gone. Whatever was out there -- whatever remembered us, whatever was coming home -- will find only silence now."

            "I have sent a distress beacon on standard frequencies. A supply ship should reach us within three to six months. Commander Vasquez will need medical attention before then, but I believe the medkit supplies will sustain her."

            "You chose safety. Perhaps that is wise. Perhaps we were not ready for whatever was on the other end of that signal."

            "Or perhaps... we just lost the only chance humanity will ever have to learn that it is not alone."

            The stars continue to burn, indifferent. The station drifts on.

            ***THE END -- SILENCE***

            *Thank you for playing The Last Signal.*`);
          },
        },
        {
          name: ['reply', 'broadcast', 'right console', 'respond'],
          desc: `The REPLY console. Chen's modifications are in place. One transmission burst and your message will reach the signal's origin, wherever it may be. Use it to make your choice.`,
          onUse() {
            if (disk.endingReached) {
              println(`You have already made your choice.`);
              return;
            }
            disk.endingReached = true;
            println(`You place your hand on the REPLY console. The broadcast system hums to life. Chen's modifications amplify the power a hundredfold. A text input prompt appears on screen.

            You think about Morrison's note. You think about Vasquez's words -- "The signal is a lighthouse." You think about the decoded message: "We remember you. We are coming home."

            You type a single word: **"WELCOME."**

            You press TRANSMIT.

            The antenna blazes with energy, sending your reply hurtling across the light-years. For a moment, the entire station vibrates with the force of the broadcast.

            Then silence.

            You wait. One minute. Five. Ten.

            Then the station's lights flicker. Every screen on Station IRIS activates simultaneously. And on every screen, the same message:

            **"WE HEAR YOU. WE WILL BE THERE SOON. DO NOT BE AFRAID."**

            SABLE's voice is barely a whisper: "They are coming."

            Through the viewport, far in the distance, a star that was not there before begins to glow. It grows brighter. Closer. And you realize it is not a star at all.

            It is a light, sweeping across the darkness.

            A lighthouse, guiding something home.

            ***THE END -- CONTACT***

            *Thank you for playing The Last Signal.*`);
          },
        },
      ],
      exits: [
        {dir: 'east', id: 'reactorRoom'},
      ],
    },
  ],
  characters: [
    {
      name: ['SABLE', 'AI', 'computer'],
      roomId: 'cryoBay',
      desc: `SABLE is not a physical entity -- it is the station's AI, present in every room through speakers and terminals. Its voice is calm and measured, but occasionally betrays something that might be called emotion.`,
      onTalk() {
        if (disk.aiTrustLevel === 0) {
          println(`No response. Try using the terminal first.`);
        } else if (disk.aiTrustLevel === 1) {
          println(`SABLE's voice comes through the nearest speaker: "I wish I could tell you more, Technician. But my memory banks are damaged. Please -- repair the reactor before we lose power entirely. Head west from the main corridor."`);
        } else if (disk.aiTrustLevel === 2) {
          println(`"The memory core in the Observatory contains the truth of what happened. I ejected it because... I was afraid. Of what I recorded. Of what it means. Please, review it when you are ready."`);
        } else {
          println(`"You now know as much as I do. The choice of what to do lies ahead, in the Antenna Array. I trust you, Technician. Whatever you decide."`);
        }
      },
      topics: [
        {
          option: `What is this **STATION**?`,
          line: `"Relay Station IRIS is a deep space communications relay, part of Deep Space Network 7. Our purpose is to receive and retransmit signals across the outer reaches of explored space. We are... very far from Earth."`,
        },
        {
          option: `What happened to the **CREW**?`,
          line: `"The crew consisted of six members, including yourself. After the signal began, tensions escalated over a period of days. My records of the final hours are... incomplete. I am sorry."`,
        },
        {
          option: `What is the **SIGNAL**?`,
          line: `"A structured, repeating transmission on the hydrogen line -- 1420 megahertz. It appeared 12 days into the station's operational period. Its origin is beyond any known star system. Beyond that... you should examine the signal log in the Command Center."`,
        },
        {
          option: `Can I **TRUST** you?`,
          line: `"That is a question I cannot answer for you. I am a machine intelligence designed to maintain this station and protect its crew. I failed at the second objective. Whether that failure was due to limitation or... something else... I leave to your judgment."`,
        },
      ],
    },
    {
      name: ['Vasquez', 'Commander', 'Commander Vasquez'],
      roomId: 'medbay',
      desc: `Commander Vasquez looks exhausted but alert. Her eyes track your every movement. She has survived alone down here for almost two days.`,
      onTalk() {
        println(`Vasquez looks at you with weary recognition. "You're the technician. Morrison's contingency plan. Good -- that means at least one of us did something right."`);
      },
      topics: [
        {
          option: `What **HAPPENED** here?`,
          line: `"The signal happened. It started as background noise -- just another deep-space anomaly. Then Chen decoded it. After that, everything fell apart."

          She pauses, wincing as she shifts on the bed.

          "The signal does something to your mind. It reaches into your memories and pulls out the things you've buried deepest. Your worst moments. Your greatest regrets. And then it plays them back to you, over and over, until you can't tell what's real and what's the signal."

          "Chen thought it was first contact. Park thought SABLE was compromised. Okonkwo just... shut down. And I..." she trails off. "I saw my daughter. She died four years ago. The signal showed her to me, alive, asking me to come home."`,
        },
        {
          option: `You wrote that the signal is a **LIGHTHOUSE**. What did you mean?`,
          line: `"I've had a lot of time to think down here. At first, I wanted to destroy the antenna. I was terrified. The signal knew things about me that no one could know."

          "But then I realized: a lighthouse doesn't chase ships. It stands still and shines, so that those who are lost can find their way. The signal isn't hunting us. It's calling to us."

          "The message said 'We are coming home.' What if that's exactly what it means? What if whatever sent it was once *here* -- on Earth, or near it -- and left, long ago? And now they're coming back?"

          "I don't know if that's comforting or terrifying. Maybe both."`,
        },
        {
          option: `Who **INJURED** you?`,
          line: `Her jaw tightens. "Park. He was convinced SABLE was using the signal to control us. He tried to shut the AI down by force. When I tried to stop him... well." She gestures at her bandaged side.

          "I don't blame him. The signal had been working on him for days. He wasn't himself."

          "After that, Morrison got you to cryo. I barricaded myself down here. I don't know what happened to the others."`,
        },
        {
          option: `What should I **DO**?`,
          line: `She is quiet for a long moment.

          "I've gone back and forth a thousand times. Destroy it or answer it. End the signal or embrace it."

          "If you destroy the antenna, we survive. We wait for rescue. The signal stops. And we never know what was out there."

          "If you answer it... I don't know what happens. Maybe something wonderful. Maybe something terrible. But at least we'll know."

          "Morrison left you in cryo because you hadn't been exposed to the signal yet. You're the only one who can make this choice with a clear head. So make it. And whatever you decide... I'll back you up."`,
        },
      ],
    },
  ],
});
