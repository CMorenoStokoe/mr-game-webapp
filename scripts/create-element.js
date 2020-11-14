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

Encapsulation:
- This is a collection of methods designed to be called from a master
file. Functions with similar purposes are grouped together. These 
functions are designed to have no dependencies other than vanilla JS. 

*/

// Create div
function createDiv(id, parent = 'body', className = null, html = null){

    // Create div element
    var div = document.createElement("DIV");
        div.id = id;
        if (className){div.className = className;}
        if (html){div.innerHTML = html;}

    // Append to parent on DOM
    if(parent=='body'){
        document.body.appendChild(div);
    } else {
        document.getElementById(parent).appendChild(div);
    }
}

// Create paragraph
function createP(id, html, parent, className = null){

    // Create button element
    var p = document.createElement("P");
        p.id = id;
        p.innerHTML = html;

        if (className){p.className = className;}

    // Append to parent on DOM
    document.getElementById(parent).appendChild(p);
}

// Create another element
function createHeader(id, parent, html, className = null, size = 'H5'){

    // Create button element
    var obj = document.createElement(size);
        obj.id = id;
        obj.innerHTML = html;
        if (className){obj.className = className;}

    // Append to parent on DOM
    document.getElementById(parent).appendChild(obj);
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

// Create modal
function createModal(id, parent, title='', body='', className='modal'){

    // Construct modal
    const html = `
        <div class="${className}" tabindex="-1" role="dialog" id="${id}">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${id}-title">${title}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="${id}-body">
                        <p>${body}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `
  
    // Append modal to dom
    document.getElementById(parent).innerHTML += html;
};


