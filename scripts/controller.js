/*

Controller
=========
Description:
This file contains the functions to create the controls for the game

Use:
It is called by the main script and calls other secondary functions.

*/


/* Initialise controls */


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


/* Add controls to elements */


// Function to build clickable nodes
function addOnclickEventsToNodes(gameData){
    
    // Add onclick function to nodes
    d3.selectAll('g').on("click", function(){

        // Intervene on node if it is a valid  target  
        if(this.id){ // Ignore anomalous behaviour (where 'this' is window since this ignores any element calling this without an ID)
            // Disable intervening directly on the objective
            if(gameData.objective == undefined){
                interveneOnTrait(this.id);
            } else if(!(this.id == gameData.objective.id)){ 
                interveneOnTrait(this.id);
            }
        }

        // Intervention function
        function interveneOnTrait(id){
            
            // Select trait for intervention
            document.getElementById('intervention-text').innerText = gameData.nodes[id].label;
            document.getElementById('intervention-btn').setAttribute('data-nodeId', id);

            // Order intervention
            playerMadeIntervention(id);
            //$('#intervention-modal').modal('show'); // Disabled: Brings up modal to select intervention direction)
        }
    })
}

// Function to add interactive visualisation controls
function interactiveVisualisationControls(){
    
    // Reset button (shown on interactive visualisation)
    // [on DOM]
    //addOnclickEvent('iv_reset', function(){gamestates[gameState].action()});

}

// Function to add test controls
function initialiseTestControls(){

    d3.selectAll('g').on("click", function(){

        // If this node is a valid intervention target
        if(this.id){ // Ignore anomalous behaviour where 'this' is window (ignores any element calling this without an ID)
            if(!(this.id == gameData.objective.id)){ // Disable intervening directly on the objective

                // Choose choice action in test
                userChoseAnswer(this.id);
            }
        }
    })

}