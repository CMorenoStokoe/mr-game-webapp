/* 

Utility functions 
-----------------
Description:
These functions provide utilities for example generating random
numbers within a range or scaling numbers to a certain number
of decimal places.

Use:
These functions are called by the main view script when required 
for operations as part of functions in that script.

*/

// Display numbers with a sensible amount of decimals
function to4SF(number){
    const absoluteValue = Math.abs(number); // Get the absolute value

    if (absoluteValue == 0){
        return number.toFixed(0)
    } else if (absoluteValue < 0.0001){
        return number.toFixed(5)
    } else if(absoluteValue < 0.001){
        return number.toFixed(4)
    } else if(absoluteValue < 0.01){
        return number.toFixed(4)
    } else if(absoluteValue < 0.1){
        return number.toFixed(3)
    } else if(absoluteValue < 1){
        return number.toFixed(2)
    } else if(absoluteValue < 10){
        return number.toFixed(2)
    } else if(absoluteValue < 100){
        return number.toFixed(1)
    } else {
        return number.toFixed(0)
    }
}

// Display numbers without decimals
function to0SF(number){
    const absoluteValue = Math.abs(number); // Get the absolute value

    if (absoluteValue == 0){
        return number.toFixed(0)
    } else if(absoluteValue < 0.05){
        return 0.1
    } else if(absoluteValue < 0.99){
        return number.toFixed(1)
    } else {
        return number.toFixed(0)
    }
}

  
// Function to generate random number (from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Function to bound scores within min & max
function boundToRange(num, min=0, max=5){
    return(Math.min(Math.max(min, num), max))
}

// Function to indicate sign
function indicateSign(b){ if(b>0){return '+'} else {return ''}; }
