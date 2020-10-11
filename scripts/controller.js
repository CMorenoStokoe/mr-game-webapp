/*

Controller
=========
Description:
This file contains the functions to create the controls for the game

Use:
It is called by the main script and calls other secondary functions.

*/

// Function to intialise login
function initialiseLogin(){
    
    // Make login button
    addOnclickEvent('splash-button', function(){
        const username = document.getElementById('splash-form').value;
        if(username){
            createNewUser(
                username,
                function(){loadPlayerData(username)}
            );
            dismissSplash();
        } else {alert('Please enter your username')}
    });
}

// Function to intiialise game controls
function initialiseControls(gameData){

    // Add event to show information on-clicking nodes
    addOnclickEventsToNodes(gameData);
            
    // Intervention controls

        // Radio buttons for selecting direction for intervention
        document.getElementById('intervention-direction-form').addEventListener('change',
            function(){
                
                // Get direction value on radio change
                const direction = document.getElementById('intervention-direction-form').direction.value;
                
                // Update text with current intervention direction
                document.getElementById('intervention-direction').innerText = direction;
            }
        )

        // Intervention button
        $('#intervention-btn').on('click', function(){

            // Get intervention paramaters
            const direction = document.getElementById('intervention-direction-form').direction.value;
            const targetNodeId = this.getAttribute('data-nodeId');

            // Order intervention
            playerMadeIntervention(targetNodeId, direction)
        })

    // Wins screen dismiss button
    $('#win-screen-btn').one('click', function(){$('#win-screen').css('opacity', 0).hide()})
}

// Function to build clickable nodes
function addOnclickEventsToNodes(gameData){
    
    // Add onclick function to nodes
    d3.selectAll('g').on("click", function(){

        // If this node is a valid intervention target
        if(this.id){ // Ignore anomalous behaviour where 'this' is window (ignores any element calling this without an ID)
            if(!(this.id == gameData.objective.id)){ // Disable intervening directly on the objective

                // Select trait for intervention
                document.getElementById('intervention-text').innerText = gameData.nodes[this.id].label;
                document.getElementById('intervention-btn').setAttribute('data-nodeId', this.id);
                
                // Order intervention (direct instead of bringing up modal)
                playerMadeIntervention(this.id);
                //$('#intervention-modal').modal('show');
            }
        }
    })
}
