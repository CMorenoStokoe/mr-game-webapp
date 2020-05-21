/* 

Event handling functions
---------------

Intended purpose of this script:
- These functions are intended for timing and triggering functions. 

Contents of this script:
- Timing and delay
    Functions designed to delay or time functions
    
- Event control
    Functions designed to trigger other functions on an event (e.g., click)

Encapsulation:
- This is a collection of methods designed to be called from a master
file. Functions with similar purposes are grouped together. These 
functions are designed to have no dependencies other than vanilla JS. 

*/


// Trigger function on window on-load
window.onload=function(){
    null
}


// Trigger function on element click
function addEventListener(id, event){

    document.getElementById(id).addEventListener("click", event);
}