/*

Notifications
=============
Description:
This script handles delivering and logging messages sent to the player.

Use:
The main view and the tutorial scripts call these functions to display 
messages to players and log these in the log menu in case they want to 
revisit them later or miss them.

*/

// Construct message
function constructMessage(d){
    const id = d.id;
    const title = d.title;
    const body = d.body;
    const position = d.position;
    const width = d.width ? d.width : 'auto';
    const btnText = d.btnText;

    // Create container
    var container = document.createElement('DIV');
        container.id = id;
        container.className = 'w-100 h-100';
        container.style.opacity = 0;
        container.style.display = 'none';
        container.style.zIndex = 99;
        container.style.textShadow = 'none';
        container.style.color = 'black';
        container.style.overflow = 'auto';

        // Position element
        if(position.type === 'auto'){ 
            
            // Auto positioning
            container.style.position = 'absolute';
            container.style.left = 0;
            container.style.top = 0;
            document.body.appendChild(container) 
        }
        if(position.type === 'onElement'){ document.getElementById(position.element).appendChild(container) }
        if(position.type === 'absolute'){ document.body.appendChild(container) } 

    // Flex box for centering
    var flexBox = document.createElement('DIV');
        flexBox.className = 'h-100 d-flex flex-row align-items-center justify-content-center';
    
        // Absolute positioning
        if(position.type === 'absolute'){
            flexBox.style.left = position.x;
            flexBox.style.top = position.y;
            flexBox.className = '';
            flexBox.style.overflow = 'auto';
        } 
    
    container.appendChild(flexBox);

    // Create div
    var div = document.createElement('DIV');
        div.className = 'card p-2';
        div.style.overflow = 'auto';
        div.style.maxHeight = '80vh';
        div.style.maxWidth = '40rem';
        if(btnText == 'Dismiss'){div.style.background = '#eee';}
    flexBox.appendChild(div);
    
    // Add title
    var head = document.createElement('H5');
        head.innerHTML = title;
        head.className = 'text-center p-2';
    div.appendChild(head); // Append to DOM
    
    // Content div
    var content = document.createElement('DIV');
        content.className = 'd-flex flex-row';

    // Add main body text
    var p = document.createElement('P');
        p.innerHTML = body;
        p.className = 'text-center p-2';
    div.appendChild(p); // Append to DOM

    // Add button to dismiss
    var btn = document.createElement('BUTTON');
        btn.id = `${id}-btn`;
        btn.className = 'btn w-100 btn-lrg btn-custom';
        if(btnText == 'Dismiss'){btn.className = 'btn w-100 btn-lrg btn-secondary';}
        btn.innerHTML = `${btnText ? btnText : 'Continue'}`;
        btn.onclick = function(){ $(`#${container.id}`).hide() };
    div.appendChild(btn); // Append to DOM
}