"use strict";

//Upon accessing the entryway, the beginning of the story should load, followed by options and items.

target.addEventListener() // add a click event listener to a START BUTTON

// Click event starts function that loads map and room image (with character)
    //Story displays, followed by list of options
        //Basic Actions: Examine, Take, Use
            // Examine: Room
            // Examine: Bloodstain
            // Take: Candle --> Use: Candle

// Use: Door -----> Hallway (run additional story and description), access STAIRS, LIBRARY, LIVING ROOM, KITCHEN, DINING ROOM
    // Should each room be a separate file?
    // Should one file hold all the interactive objects?
    // Things: Candle, Journal page, Shovel, Photograph, body1, body2
    // If numberOfJournalPages === 3 {character can go up stairs without triggering ghostBlock()}
    // Pages read in same order regardless of where or when they are found (i.e. 1st page found becomes page 1)



var entryWay = {
    candle:
    journal:
}