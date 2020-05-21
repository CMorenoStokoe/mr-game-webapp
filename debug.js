/* 

Debug functions 
---------------

Intended purpose:

These functions are intended for testing the main functions

*/

const debug = true;

// Quick print to console log with preface
function log(message){

    if (debug == true){console.log("[Debug] " + message )};
}

// Return the attribute of element
function get(id, prop=null, child=null){

    // Get first child if the child of an element is requested, else get the element itself
    if (child){
        element = document.getElementById(id).children[0];
    } 
    else {
        element = document.getElementById(id);
    } 

    // Get the specified properties of the element, 
    if (Array.isArray(prop)){
        return(element[prop[0]][prop[1]]); // If multiple properties use them sequentially as keys (e.g., element.style.color)
    } else if (prop){
        return(element[prop]); // If property is not an array then use it as a key (e.g., element.id)
    } else {
        return(element); // If no property is given then return the element itself (e.g., [HTML DOM Object: element type])
    }
    
}

// Test whether expected and actual values passed into this function agree
function validate(values){
    passed = []
    failed = []
    
    // Recieves array of values to check 
    for (const value of values){
        
        // Output a pass or fail message in console for each value pair
        if(value.actual == value.expected){
            passed.push(value.name);
            console.log(value.name + ' : ' + '%cPass', 'color: green;');
        }else{
            failed.push(value.name + ' : ' + 'Fail' + ' (expected ' + value.expected + ' got ' + value.actual + ')')
            console.log(value.name + ' : ' + '%cFail' + ' (expected ' + value.expected + ' got ' + value.actual + ')', 'color: red;');
        }
    }
    
    return({'passed': passed, 'failed' : failed})
}