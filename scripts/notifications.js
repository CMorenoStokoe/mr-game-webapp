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

// Send message to player
function notify(title, body, width = '600px', position = {x:'45vw', y:'45vh'}, contextIndicator = null){

    // Construct and send message
    constructMessage(title, body, width, position, contextIndicator);

    // Log message
    //writeToLog(`${title}<br>${body}`);
    
}

// Construct message
function constructMessage(title, body, width, position, contextIndicator){

    // Create div
    var div = document.createElement('DIV');
        div.className = 'card tutorial';
        div.style.position = 'absolute';
        div.style.left = position.x;
        div.style.top= position.y;
        div.style.minWidth= width;
    document.body.appendChild(div); // Append to DOM
    
    // Add title
    var head = document.createElement('H5');
        head.innerText = title;
        head.className = 'text-center p-2';
    div.appendChild(head); // Append to DOM
    
    // Add main body text
    var p = document.createElement('P');
        p.innerHTML = body;
        p.className = 'text-center p-2';

        // Add arrow to indicate context (if required)
        if(contextIndicator){ // Options e.g., arrow-up, arrow-left

            // Make space for arrow
            p.className = 'text-center p-2 col-md-9';

            // Add arrow
            var indicator = document.createElement('P');
                indicator.className = 'col-md-3 d-flex justify-content-center align-items-center';
                indicator.innerHTML = `<i class="fas fa-${contextIndicator}" style='font-size: 3em;'></i>`;
            div.appendChild(indicator); // Append to DOM
        }
    
    div.appendChild(p); // Append to DOM

    // Add button to dismiss
    var btn = document.createElement('BUTTON');
        btn.className = 'btn w-100 btn-lrg btn-custom';
        btn.innerText = 'Continue';
        btn.onclick = function(){$(this).parent.hide()};
    div.appendChild(btn); // Append to DOM
}