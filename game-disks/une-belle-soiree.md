# TODO:

## Une Belle Soiree
* Ending: Take off dress; go into pool; offer statue rum; gate opens behind you; THE END.
* At some point, add IN as an exit to FOUNTAIN, blocked by "You don't want to get your dress wet."
* Add a character to the game who the player can ask for directions. The player gives the name of a room they want to get to and the character responds with a list of directions from BFS.

## text-engine
* When pressing UP to get to last command, move cursor to the end of the line
* Allow pressing TAB to autocomplete, for instance TAKE INV -> TAKE INVITATION
* Add a "block" string property to exits. If player tries to go in that direction, print the string.
* Fix bug with TALK TO. After using carriage door, talking to Gapsard logs:
```
Uncaught TypeError: Cannot read property 'toLowerCase' of undefined
    at findCharacter (index.js:357)
    at talk (index.js:397)
    at exec (index.js:164)
    at Object.3 (index.js:449)
    at applyInput (index.js:454)
    at HTMLInputElement.input.onkeypress (index.js:67)
```
* Add a feature to clear screen and print at top
