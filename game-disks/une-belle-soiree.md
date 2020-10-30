# TODO:

## Une Belle Soiree
* Ending: Take off dress; go into pool; offer statue rum; gate opens behind you; THE END.
* At some point, add IN as an exit to FOUNTAIN, blocked by "You don't want to get your dress wet."
* Add a character to the game who the player can ask for directions. The player gives the name of a room they want to get to and the character responds with a list of directions from BFS.
* In `enterRoom`, fade out any ambient loop. If the new room has the name of an ambient loop sound defined, fade in that loop.
* For branching conversations, simplify configuration. For instance, conversationStep should be added automatically (at 0) if it's not on the character.

## text-engine
* Add a feature to clear screen and print at top.
* Clean up conversation API and move it fully into the engine (with options for static or branching.)
* Add documentation describing global methods (and how to override them).
* Deprecate passing global functions to various methods (and reflect this change in the docs).
* Add documentation for conversations.
* Document other engine changes.
* Add auto-complete for conversation topic keywords.
* BUGFIX: For some reason, auto-complete doesn't work for the PANELS in the ENTRY.
* Add the ITEMS command to the HELP menu.
* Add CHARS / CHARACTERS command to list who is in the room (and add this to the HELP menu).
* When printing list of directions from the GO command, display the dir in uppercase.
