# TODO:

## Une Belle Soiree
* Ending: Take off dress; go into pool; offer statue rum; gate opens behind you; THE END.
* At some point, add IN as an exit to FOUNTAIN, blocked by "You don't want to get your dress wet."
* Add a character to the game who the player can ask for directions. The player gives the name of a room they want to get to and the character responds with a list of directions from BFS.
* In `enterRoom`, fade out any ambient loop. If the new room has the name of an ambient loop sound defined, fade in that loop.
* For branching conversations, simplify configuration. For instance, stepIndex should be added automatically (at 0) if it's not on the character.
* Rename `stepIndex` to `conversationStep` or something similar so we're not confused about what it represents.

## text-engine
* Allow pressing TAB to autocomplete, for instance TAKE INV -> TAKE INVITATION.
* Add a "block" string property to exits. If player tries to go in that direction, print the string.
* Add a feature to clear screen and print at top.
* Use N,E,S and W as shorthand for Go North, East, South and West commands.
