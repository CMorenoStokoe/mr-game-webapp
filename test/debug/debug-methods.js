/* 

Debug functions 
---------------

Intended purpose:

These functions are intended for testing the main functions

*/

const debug = false; // Disable logging to clear console

// Return the attribute of element
function get(id, prop=null, child=null){

    // Get first child if the child of an element is requested
    if (child){
        element = document.getElementById(id).children[0];
    } 

    // Else get the element itself
    else {
        element = document.getElementById(id);
    } 

    // Get the specified properties of the element and use different processes to get this
    if (Array.isArray(prop)){ 
        
        switch(prop[0]){

            // If getAttr is first property in array, caller is asking for a getAttribute() method
            case 'getAttr': 
                return(element.getAttribute(prop[1]));

            // Otherwise use multiple properties sequentially as keys (e.g., element.style.color)
            default:
                return(element[prop[0]][prop[1]]); 
        }
    } 

    // If property is not an array then use it as a key (e.g., element.id)
    else if (prop){
        return(element[prop]); 
    }

    // If no property is given then return the element itself (e.g., [HTML DOM Object: element type])
    else {
        return(element); 
    }

}

// Test whether expected and actual values passed into this function agree
function validate(values){
    passed = []
    failed = []
    valuesDict = {};
    
    // Recieves array of values to check 
    for (const value of values){

        // Output a pass or fail message in console for each value pair
        if(value.actual == value.expected){
            value.status = 'Pass';
            passed.push(value.name);
            //console.log(value.name + ' : ' + '%cPass', 'color: green;');
        }else{
            value.status = 'Fail';
            failed.push(value.name + ' : ' + 'Fail' + ' (expected ' + value.expected + ' got ' + value.actual + ')')
            //console.log(value.name + ' : ' + '%cFail' + ' (expected ' + value.expected + ' got ' + value.actual + ')', 'color: red;');
        }
        
        valuesDict[value.name]=value;// Add entry to searchable dictionary of results

    }
    
    return({values : valuesDict, 'passed': passed, 'failed' : failed})
}

// Function to test the size of an object (e.g., how many items in a dictionary)
objSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};