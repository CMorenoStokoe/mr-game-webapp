/* 

Create DOM element functions
---------------

Intended purpose of this script:
- These functions are intended creating new DOM elements.

Contents of this script:
- Create elements
    Functions designed to add new elements to the DOM (e.g., buttons,
    divs, anchors, progress bars etc.)

- Return elements
    Functions designed to return elements, for use by other create
    element methods

- HTML templates   
    HTML templates for new elements and styles (e.g., badges and spacing)

Encapsulation:
- This is a collection of methods designed to be called from a master
file. Functions with similar purposes are grouped together. These 
functions are designed to have no dependencies other than vanilla JS. 

*/

// Create div
function createDiv(id, parent, className = null){

    // Create div element
    var div = document.createElement("DIV");
        div.id = id;

        if (className){div.className = className;}

    // Append to parent on DOM
    document.getElementById(parent).appendChild(div);
}

// Create paragraph
function createP(id, text, parent, className = null){

    // Create button element
    var p = document.createElement("P");
        p.id = id;
        p.innerHTML = text;

        if (className){p.className = className;}

    // Append to parent on DOM
    document.getElementById(parent).appendChild(p);
}

// Return font-awesome icon 
function faIcon(iconName, className = null){

    // Build font-awesome icon element
    template = '<i class="fas fa-' + iconName + ' ' + className + '"></i>'
    
    // Return constructed icon element
    return(template)
}

// Create button
function createButton(id, text, parent, className = null){

    // Create button element
    var btn = document.createElement("BUTTON");
        btn.id = id;
        btn.innerHTML = text;

        if (className){btn.className = className;}

    // Append to parent on DOM
    document.getElementById(parent).appendChild(btn);
    
}

// Create progress bar
function createProgress(id, parent, templateId='progress_bar_template'){

    // Clone progress bar from existing template with all children and event handlers
    var div = document.getElementById(templateId),
        clone = div.cloneNode(true);
    clone.id = id;

    // Append to parent on DOM
    document.getElementById(parent).appendChild(clone);
}

/* HTML templates */
//html = "<span class=\"badge badge-danger btnAlert\" id=\"" + id + "-alert\">" + text + "</span>"