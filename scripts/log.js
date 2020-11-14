/*

Log
===
Description:
This script creates a log of events on the DOM and writes to 
it to help players keep track of in-game events.

Use:
The main view script calls these functions to initialise
and write events.

*/

// Initialise log
function initLog(id='menu-log'){
    
    // Prepare modal body for logging messages
    $(`#${id}-body`).css('overflow-y', 'scroll')

}

// Write to log
function writeToLog(message, id='menu-log'){

    var entry = document.createElement('DIV');
        entry.className = 'card';
        entry.innerHTML = message;

    document.getElementById(`${id}-body`).appendChild(entry);

}

