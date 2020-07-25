/* 

Edit DOM element functions
---------------

Intended purpose of this script:
- These functions are intended for editing elements already on the DOM.

Contents of this script:
- Properties
    Functions designed to edit the properties of DOM elements

- Text and code content
    Functions designed to add or edit text and code content on the DOM

Encapsulation:
- This is a collection of methods designed to be called from a master
file. Functions with similar purposes are grouped together. These 
functions are designed to have no dependencies other than vanilla JS. 

*/


// Text content
function setText(id, content){

    document.getElementById(id).textContent = content;
}

// HTML content
function setHTML(id, html){

    document.getElementById(id).innerHTML = html;
}

// Visibility
function setVisibility(id, visibility){
    
    document.getElementById(id).style.visibility = visibility;
}
function toggleVisibility(id){
    currentState = document.getElementById(id).style.visibility;
    if(currentState=='visible'){
        document.getElementById(id).style.visibility = 'hidden';
    } else {
        document.getElementById(id).style.visibility = 'visible';
    }
}

// Display
function setDisplay(id, display){

    document.getElementById(id).style.display = display;
}

// Progress bar attributes
function setProgress(id, value, range = null){
    
    // Select child progress bar div from parent
    progress = document.getElementById(id).children[0];
    
    // If min/max values are given set range of progress bar
    if(range){
        progress.ariaValueMin = range.min;
        progress.ariaValueMax = range.max;
    }

    // Set current value of progress bar and accompanying label
    progress.ariaValueNow = value
    progress.innerHTML = value

    // Convert values to percentages for width
    progress.style.width = value/progress.ariaValueMax*100+'%'
}

// Background color
function colorBackground(id, color){
    document.getElementById(id).style.backgroundColor = color;
}

// Text color
function setColor(id, color){
    document.getElementById(id).style.color = color;
}

// Disable element
function setDisabled(id){
    document.getElementById(id).disabled = true;
}

// Number rounding
function roundNum (num, percent = false){
    
    // Scale decimals as a function of number size to 2 significant figures up to 4 decimal places
    if (num >= 100) {rounded = num.toFixed(0)}
    else if (num >= 10) {rounded = num.toFixed(1)} // 3 signifcant figures for numbers 10-99
    else if (num >= 1) {rounded = num.toFixed(1)}
    else if (num >= 0.1) {rounded = num.toFixed(2)}
    else if (num >= 0.01) {rounded = num.toFixed(3)}
    else if (num >= 0.001) {rounded = num.toFixed(4)}
    else if (num >= 0.0001) {rounded = num.toFixed(4)}
    else if (num < 0.0001) {rounded = num.toFixed(4)}
    else {rounded = num.toFixed(2)} // Failsafe in case of number somehow outside of expected ranges
    
    // Return number as text string with % at the end if output requested in percent format
    if(percent){
        return rounded+'%';
    } else {
        return rounded;
    }
}

// Toggle show-hide panels
class Panel {

    // For each toggleable panel initialise a Panel class object
    constructor(id, side) {
        this.id = id;
        this.element = document.getElementById(id);
        this.side = side;
        this.position = this.getPos(this.side);
        this.width = this.element.style.width;
        this.widthValue = this.getWidthValue(this.width);
        this.widthUnits = this.getWidthUnits(this.width);
        this.close = this.close();
        this.open = this.open();
    }
    
    // Get units of width
    getWidthUnits(width){
        return(width.replace(/-|[0-9]/g, ''));
    }

    // Get numerical value of width
    getWidthValue(width){
        return(width.match(/-?\d+/g).map(Number)[0]);
    }

    // Add a method to get position of panel
    getPos(side){
        if (side=='left'){
            return (this.element.style.left);
        } else if (side=='right'){
            return (this.element.style.right);
        }
    }

    // Adding methods to toggle the panel
    open(){
        console.log(this.element.style[this.side])
        this.element.style[this.side] = 0;
    }
    close(){
        console.log(this.element.style[this.side])
        this.element.style[this.side] = `${0 - this.widthValue}${this.widthUnits}`;
    }
    
}