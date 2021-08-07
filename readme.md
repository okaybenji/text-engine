```
   ████████ ███████ ██   ██ ████████               
      ██    ██       ██ ██     ██                  
      ██    █████     ███      ██     █████            
      ██    ██       ██ ██     ██                  
      ██    ███████ ██   ██    ██                  
                                                
███████ ███    ██  ██████  ██ ███    ██ ███████ 
██      ████   ██ ██       ██ ████   ██ ██      
█████   ██ ██  ██ ██   ███ ██ ██ ██  ██ █████   
██      ██  ██ ██ ██    ██ ██ ██  ██ ██ ██      
███████ ██   ████  ██████  ██ ██   ████ ███████
```

An HTML-based text adventure game engine. Small and easy to use with no dependencies. Highly customizable.

Very little programming is required, but several JavaScript hooks are provided if you are inclined to use them!

### How do I use it?
To create your own adventure, you can use one of the files in the [game-disks](https://github.com/okaybenji/text-engine/blob/master/game-disks) folder as a template. For example, take a look at [the disk called newDiskTemplate](https://github.com/okaybenji/text-engine/blob/master/game-disks/new-disk-template.js).

Include your "game disk" (JSON data) in index.html and load it with `loadDisk(myGameData)`. (Look at [index.html](https://github.com/okaybenji/text-engine/blob/master/index.html) in the repo for an example.)

The end product will be your very own text adventure game, similar to [this one](http://okaybenji.github.io/text-engine). It's a good idea to give that game a try to get introduced to the engine.

![Demo Screenshot](screenshot.gif "Demo Screenshot")

`text-engine` uses a disk metaphor for the data which represents your game, like the floppy disks of yore.

Including [index.js](https://github.com/okaybenji/text-engine/blob/master/index.js) from this repository in your [index.html](https://github.com/okaybenji/text-engine/blob/master/index.html) `<script>` adds a several functions to the global namespace. One of these is called `loadDisk`. `loadDisk` accepts a single argument, which is your disk -- a standard JavaScript object (JSON).

## Disks
A disk is a JavaScript object which describes your game. At minimum, it must have these two top-level properties:

| Property    | Type     | Description |
| ----------- | -------- | ----------- | 
| `roomId`    | String   | This is a reference to the room the player currently occupies. Set this to the ID of the `room` the player should start in. |
| `rooms`     | Array    | List of rooms in the game. |

There are other properties you can choose to include if you like:

| Property    | Type     | Description |
| ----------- | -------- | ----------- |
| `inventory` | Array    | List of items in the player's inventory. |
| `characters`| Array    | List of characters in the game. |

You can also attach any arbitrary data you wish. For instance, you could have a number called "health" that you use to keep track of your player's condition.

### What's a room?
A room is a JavaScript object. You usually want a room to have the following properties:

| Property  | Type     | Description |
| --------- | -------- | ----------- | 
| `name`    | String   | The name of the room will be displayed each time it is entered. |
| `id`      | String   | Unique identifier for this room. Can be anything. |
| `desc`    | String   | Description of the room, displayed when it is first entered, and also when the player issues the `look` command. |
| `exits`   | Array    | List of paths from this room. |

Rooms can have these other optional properties as well:

| Property  | Type     | Description |
| --------- | -------- | ----------- |
| `img`     | String   | Graphic to be displayed each time the room is entered. (This is intended to be ASCII art.) |
| `items`   | Array    | List of items in this room. Items can be interacted with by the player. |
| `onEnter` | Function | Function to be called when the player enters this room. |
| `onLook` | Function | Function to be called when the player issues the `look` command in this room. |

### What's an exit?

An exit is an object with the following properties:

| Property | Type   | Description |
| -------- | ------ | ----------- | 
| `dir`    | String | The direction the player must go to leave via this exit (e.g. "north". |
| `id`     | String | The ID of the room this exit leads to. |

An exit can optionally have a `block` as well:

| Property | Type   | Description |
| -------- | ------ | ----------- |
| `block`  | String | Line to be printed if the player tries to use this exit. If this property exists, the player cannot use the exit. |

### What's an item?

An item is an object with a name:

| Property     | Type     | Description |
| ------------ | -------- | ----------- | 
| `name`       | String or Array | How the item is referred to by the game and the player. Using an array allows you to define multiple string names for the item. You might do this if you expect the player may call it by more than one name. For instance ['basketball', 'ball']. When listing items in a room, the engine will always use the first name in the list. |

Items can have these other optional properties as well:

| Property     | Type     | Description |
| ------------ | -------- | ----------- | 
| `desc`       | String or Array | Description displayed when the player looks at the item. If multiple descriptions are provided, one will be chosen at random. |
| `isTakeable` | Boolean  | Whether the player can pick up this item (if it's in a room). Defaults to `false`. |
| `onUse`      | Function | Function to be called when the player uses the item. |
| `onLook`     | Function | Function to be called when the player looks at the item. |
| `onTake`     | Function | Function to be called when the player takes the item. |

### What's a character?

A character is an object with the following properties:

| Property     | Type     | Description |
| ------------ | -------- | ----------- |
| `name`       | String or Array | How the character is referred to by the game and the player. Using an array allows you to define multiple string names for the character. You might do this if you expect the player may call them by more than one name. For instance ['Steve', 'waiter', 'garçon']. When listing characters in a room, the engine will always use the first name in the list. |
| `roomId`     | String   | The ID of the room the character is currently in. The player can only talk to characters in the room with them. |

Characters can have these other optional properties as well:

| Property     | Type     | Description |
| ------------ | -------- | ----------- |
| `desc`       | String or Array | Description. Text displayed when the player looks at the character. If multiple descriptions are provided, one will be chosen at random. |
| `topics` | String or Array  | If a string is provided, it will be printed when the player talks to this character. Otherwise, this should be a list of topics for use in the conversation with the character. |
| `onTalk`     | Function | Function to be called when the player talks to the character. |
| `onLook`     | Function | Function to be called when the player looks at the character. |

### What's a topic?

A topic is something you can talk to a character about, and as you may have guessed, is a JavaScript object. A topic requires an `option`, and either a `line` or an `onSelected` function, or both:

| Property     | Type     | Description |
| ------------ | -------- | ----------- |
| `option`     | String   | The choice presented to the player, with a KEYWORD the player can type to select it. If the keyword is written in uppercase, the engine can identify it automatically. (Otherwise, you'll need to specify the keyword in a separate property.) The option can be just the keyword itself, or any string containing the keyword. |
| `line`       | String   | The text to display when the user types the keyword to select the option. |
| `onSelected` | Function | Function to be called when the player types the keyword to select the option. |

Topics can have these other optional properties as well:

| Property     | Type     | Description |
| ------------ | -------- | ----------- |
| `removeOnRead` | Boolean | Whether this option should no longer be available to the player after it has been selected once. |
| `prereqs`    | Array    | Array of keyword strings representing the prerequisite topics a player must have selected before this one will appear. (When topics are selected, their keywords go into an array on the character called "chatLog".) |
| `keyword`    | String   | The word the player must type to select this option. This property is only required if the option itself does not contain a keyword written in uppercase. |

That's everything! If you've made a JSON object with a `roomId` and a list of `rooms` -- that is, a disk -- you've got a playable game!

### How do I play it?
Just pass a reference to your disk to the loadDisk function. Take a look at [index.html](https://github.com/okaybenji/text-engine/blob/master/index.html) to see an example.

I've saved my disk to a `const` variable called `demoDisk` in [game-disks/demo-disk.js](https://github.com/okaybenji/text-engine/blob/master/game-disks/demo-disk.js). I've included that file and `index.js` in my HTML file, and added a script tag with a single line to call `loadDisk(demoDisk)`. The game boots when [index.html](https://github.com/okaybenji/text-engine/blob/master/index.html) is loaded in a web browser.

You can use the included [index.html](https://github.com/okaybenji/text-engine/blob/master/index.html) file in your own project, or you can create your own.

#### Making your own HTML file

Sometimes you just want to start from scratch. If you wish to make your own HTML file, just be sure it contains the following two elements:

* A `div` with ID `output`. This is where the game text will appear.
```html
<div id="output"></div>
```
* An `input` with ID `input`. This is where the player will enter commands.
```html
<input id="input" autofocus>
```

Once your game is running, the player can use the following commands:

```
  LOOK:   'look at key'
  TAKE:   'take book'
  GO:     'go north'
  USE:    'use door'
  TALK:   'talk to mary'
  ITEMS:  list items in the room
  INV:    list inventory items
  SAVE:   save the current game
  LOAD:   load the last saved game
  HELP:   this help menu
```

## Functions
Functions are reuseable bits of JavaScript code. text-engine provides several of these which you can use, for instance in callbacks like `onUse`, `onLook`, `onEnter`, etc.

Writing and using functions is optional, but they give you a great deal more flexibility with the sort of game you can make.

### println
Print a line of text to the console. It takes up to two arguments:

| Argument     | Type     | Description |
| ------------ | -------- | ----------- |
| `line`       | String   | The text to be printed. |
| `className`  | String   | *Optional.* The name of a CSS class to apply to the line. You can use this to style the text. |

### pickOne
Get a random item from an array. It takes one argument:

| Argument     | Type     | Description |
| ------------ | -------- | ----------- |
| `arr`        | Array    | The array with the items to pick from. |

### getRoom
Get a reference to a room by its ID. It takes one argument:

| Argument     | Type     | Description |
| ------------ | -------- | ----------- |
| `id`         | String   | The unique identifier for the room. |

### enterRoom
Move the player to particular room. It takes one argument:

| Argument     | Type     | Description |
| ------------ | -------- | ----------- |
| `id`         | String   | The unique identifier for the room. |

### getExit
Get a reference to an exit by its direction name from a list of exits. It takes two argument:

| Argument     | Type     | Description |
| ------------ | -------- | ----------- |
| `dir`        | String   | The name of the exit's `dir` (direction) property, e.g. "north". |
| `exits`      | Array    | The list of exits to search. (Usually you would get a reference to a room and pass `room.exits`.) |

### getCharacter
Get a reference to a character. It takes up to two arguments:

| Argument     | Type     | Description |
| ------------ | -------- | ----------- |
| `name`       | String   | The character's name. |
| `chars`      | Array    | *Optional.* The array of characters to search. Defaults to searching all characters on the disk. |

### getCharactersInRoom
Get an array containing references to each character in a particular room. It takes one argument:

| Argument     | Type     | Description |
| ------------ | -------- | ----------- |
| `roomId`     | String   | The unique identifier for the room. |

### getItemInRoom
Get a reference to an item in a particular room. It takes two arguments:

| Argument     | Type     | Description |
| ------------ | -------- | ----------- |
| `itemName`   | String   | The name of the item. |
| `roomId`     | String   | The unique identifier for the room. |

### getItemInInventory
Get a reference to an item in the player's inventory. It takes one argument:

| Argument     | Type     | Description |
| ------------ | -------- | ----------- |
| `name`       | String   | The name of the item. |

### Commands
Every command a player can issue in the game has a corresponding function in text-engine.

For instance, there's a function called "go" that gets called when the player types GO.

You can add your own custom commands, as well. Take a look at [the "unlock" command in game-disks/demo-disk.js](https://github.com/okaybenji/text-engine/blob/07d5d7488ff00b9d4ceaf6e36a5e0e654b21b7ae/game-disks/demo-disk.js#L463-L482) for an example.

#### Overriding the default command set
If existing commands don't work how you want them to, you can override them by reassigning them to your own function code.

For instance, you may wish to implement your own versions of the "save" and "load" commands. Or you may not wish to include `save` or `load` at all.

Commands are stored on a global array called `commands`. Each element in the array is a JavaScript object with methods attached. The index of the element indicates how many arguments it accepts. So, for instance, all methods attached to `commands[0]` take zero arguments.

Methods are named according to what the player types to issue them. For instance, the player can type "go" with no arguments to see available exits in the room. This command is found at `commands[0].go`.

Here are a few examples of ways to override the default commands:

```js
// Add a command which takes no arguments.
// In this example, the command is called "play", and the user would type "play" to use the command.
const play = () => println(`You're already playing a game!`);
commands[0] = Object.assign(commands[0], {play});

// Override a command's function.
// In this example, we're overriding the "save" command.
save = () => println(`Sorry, saving is not supported in this game.`);

// Remove an existing command.
// In this example, we're removing the "save" command.
delete commands[0].save;

// Completely replace existing commands.
// In this example, the only two commands available in the entire game will be "walk" and "talk".
commands = [{walk: () => println(‘you walk’), talk: () => println(‘you talk’)}];
```

If you do remove some or all of the default commands, you'll want to override the `help` function as well so that it doesn't list commands which are not supported by your game.

### Other Functions
There are several other functions available in the engine! Feel free to take a peek at the [source code](https://github.com/okaybenji/text-engine/blob/master/index.js). It's designed to be open and simple to use and to customize.

### A word of caution regarding SAVE/LOAD
The default implementation of saving and loading games in text-engine is quite simple. It converts the current state of the entire game disk to a string and saves that to your browser's Local Storage.

This simplicity comes at a cost. **Here there be dragons.** There are several things you must keep in mind as you write your disk if you want the built-in save functionality to work correctly.

Before we get to that list, I'd like to remind you that these commands can be removed from your game, or you can write your own save/load functions. (See *Overriding the default command set* above.)

Without further ado, **here are the requirements for supporting the built-in "save" and "load" commands**:

* If you publish changes to your game disk, old saves are not likely to be compatible. This is because the save contains the entire disk, and loading the save overwrites the new disk with the old one.
* Certain keywords such as "key" and "window" must be avoided as object names (because these are reserved by JavaScript and will not survive the parse). The recommended way around this is to add adjectives to your names, such as "silver key" or "tall window".
* Circular JSON structures are not supported (a property cannot point to its object's ancestor).

If you are writing functions for your game, you'll need to keep these in mind as well:

* Functions attached to the disk must not rely on [closures](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-closure-b2f0d2152b36). Closures are lost when a JSON object is converted to a string representation.
* You cannot use the [shorthand syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions) for defining methods. That is,

```js
{
  onUse() {
    // This version will not work.
  },
  onUse: () => {
    // This one is okay!
  },
}
```

## Etc.
### Useful Tools
* [REXPaint](https://www.gridsagegames.com/rexpaint) - Makes creating ASCII art super easy.
* [ASCII-Code.com](http://www.ascii-code.com) - Convenient for copying and pasting ASCII characters.
* [Text to ASCII Art Generator](http://patorjk.com/software/taag/#p=display&h=2&v=2&f=ANSI%20Regular&t=text%0A-engine) - Make ASCII logos from text.

### Acknowledgments
* Engine inspired in part by [TextAdventure.js](https://github.com/TheBroox/TextAdventure.js).
* Unlimited Adventure demo inspired by [Forgotten](https://sophiapark.itch.io/forgotten) by Sophia Park, Arielle Grimes, and Emilie Sovis and also [this screenshot](https://cdn-images-1.medium.com/max/1600/1*IRP1NLN5jQTwuWNfXXhjPA.gif), whatever it is.
* "Ultimate Apple II Font" from [KreativeKorp](http://www.kreativekorp.com/software/fonts/apple2.shtml).
* Some ASCII art adapted from [ASCII Art Archive](https://www.asciiart.eu/buildings-and-places/castles).
* Special thanks to [Caleb Creed](https://github.com/thirdcreed) for helping me flesh out the features for text-engine 2.0 and for designing and writing the auto-complete functionality.

### Updates

* 2.0.0: Added characters, conversations, auto-complete, `items` command, `save` & `load` commands, navigation shortcuts, global methods for utility or overriding, support for custom commands, `onLook` & `onTalk` callbacks, upgraded `go` command, support for `blocks` on exits, support for providing class name to `println` function, support for randomizing printed lines, bold/italic/underline text, various bug fixes & improvements.
* 1.3.0: Rooms can define `onEnter` methods.
* 1.2.0: New orange default theme.
* 1.1.1: Now supports use in other operating environments besides the DOM. See [text-engine-node](https://github.com/okaybenji/text-engine-node) for example usage. (Planning to add documentation later.)
