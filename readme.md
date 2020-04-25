## text-engine

#### What is it?
A JavaScript REPL-style text-based adventure game engine. Small (~200 lines) and easy to use with no dependencies.

#### How do I use it?
To create your own adventure, use `game-disks/unlimited-adventure.js` as a template.

Include your 'game disk' (JSON data) in `index.html` and load it with `loadDisk(myGameData)`.

#### What good will it do me?
The end product will be your very own text adventure game, similar to [this one](http://okaybenji.github.io/text-engine).

![Demo Screenshot](screenshot.gif "Demo Screenshot")

#### That was a little fast...
You're right. Here are some more in-depth instructions...

#### The loadDisk function
`text-engine` uses a disk metaphor for the data which represents your game, like the floppy disks of yore. Including `index.js` from this repository in your `index.html` `<script>`s adds a single function to the global namespace: `loadDisk`. `loadDisk` accepts a single argument, which is your disk -- a standard JavaScript object (JSON).

#### What's a disk?
A disk is a JavaScript object which describes your game. It has three top-level properties:

* `roomId` (String) - This is a reference to the room the player currently occupies. Set this to the ID of the `room` the player should start in.

* `inventory` (Array) - List of `item`s in the player's inventory. `item`s will be discussed in more detail below.

* `rooms` (Array) - List of `room`s in the game.

Note that you can also add any custom properties you want anywhere on this object. You will be able to access and modify them via the `use` functions on your items, which will be passed a reference to your disk. More on the `use` functions later...

### What's a room?
A room is an object with the following properties:

* `name` (String) - The name of the room will be displayed each time it is entered.

* `id` (String) - Unique identifier for this room. Can be anything.

* `img` (String) - Graphic to be displayed each time the room is entered. (This is intended to be ASCII art.)

* `desc` (String) - Description of the room, displayed when it is first entered, and also when the player issues the `look` command.

* `items` (Array) - List of `item`s in this room. `item`s can be interacted with by the player.

* `exits` (Array) - List of paths from this room.

### What's an exit?

An exit is an object with the following properties:

* `dir` (String) - The direction the player must go to leave via this exit.

* `id` (String) - The ID of the room this exit leads to.

### What's an item?

An item is an object with the following properties:

* `name` (String) - How the item is referred to by the game and the player.

* `desc` (String) - Text displayed when the player `look`s at the item.

* `isTakeable` (Boolean) - *Optional* - Whether the player can pick up this item (if it's in a room). Defaults to false.

* `use` (Function) - *Optional* - Function to be called when the player uses the item.

### Use functions
Use functions accept a `game` object, which is a JavaScript object with the following properties:

`disk` (Object) - A reference to your game disk. Can be used to add or change properties. For instance, to make an item which previously could not be picked up takeable.

`println` (Function) - The function which prints output for the player to see. Accepts a string.

`getRoom` (Function) - Convenience function for retrieving a reference to a room on the disk. Accepts `roomId` as a String.

`enterRoom` (Function) - The function which moves a player to a room. Accepts `roomId` as a String.

Use functions are just JavaScript functions, with the full power of the language. You can make an item do whatever you want when a player uses it. Knock yourself out.

That's everything! If you've made a JSON object with all these properties -- that is, a disk -- you've got a playable game!

### How do I play it?
Just pass a reference to your disk to the loadDisk function. Take a look at `index.html` to see an example. I've saved my disk to a `const` variable called `unlimitedAdventure` in `game-disks/unlimited-adventure.js`. I've included that file and `index.js` in my HTML file, and added a script tag with a single line to call `loadDisk(unlimitedAdventure)`. The game boots when `index.html` is loaded in a browser.

You can use the included `index.html` file in your own project, or you can create your own. If you make your own, note that you will need to add two elements:

* A `div` with ID `output`. This is where the game text will appear.
```
<div id="output"></div>
```
* An `input` with ID `input`. This is where the user will enter commands.
```
<input id="input" autofocus>
```


### Useful Tools
* [ASCII Paint](http://www.asciipaint.com) - Makes creating ASCII art super easy.
* [ASCII-Code.com](http://www.ascii-code.com) - Convenient for copying and pasting ASCII characters.

### Acknowledgments
* Engine inspired in part by [TextAdventure.js](https://github.com/TheBroox/TextAdventure.js).
* Demo inspired by [Forgotten](https://sophiapark.itch.io/forgotten) by Sophia Park, Arielle Grimes, and Emilie Sovis and also [this screenshot](https://cdn-images-1.medium.com/max/1600/1*IRP1NLN5jQTwuWNfXXhjPA.gif), whatever it is.
* "Ultimate Apple II Font" from [KreativeKorp](http://www.kreativekorp.com/software/fonts/apple2.shtml).
* ASCII art adapted from [ASCII Art Archive](https://www.asciiart.eu/buildings-and-places/castles).

### Updates

1.2.0: New orange default theme.
1.1.1: Now supports use in other operating environments besides the DOM. See [text-engine-node](https://github.com/okaybenji/text-engine-node) for example usage. (Planning to add documentation later.)
