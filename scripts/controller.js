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
                function(){incrementGamestate();}
                //function(){loadPlayerData(username)}
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
        document.getElementById('unlocks').addEventListener('change',
            function(){

                // Trigger event on player unlocking ability
                playerUnlockedAbility(
                    interventionMax = document.getElementById('unlocks').max.value,
                    interventionStrength = document.getElementById('unlocks').strength.value,
                );
            }
        )

    // Win screen dismiss button
    $('#win-screen-btn').one('click', function(){$('#win-screen').css('opacity', 0).hide()})
}


/* Add controls to elements */


// Function to build clickable nodes
function addOnclickEventsToNodes(gameData){
    
    // Add onclick function to nodes
    d3.selectAll('image').on("click", function(){

        // Get node ID
        const node = d3.select(this.parentNode); // From parent node of icon
        const id = node.attr('id'); 

        // Intervene on node if it is a valid  target  

            // Check exclusion criteria
            console.log(playerInterventionCount, playerInterventionMax)
            function invalidTarget(){
                if(!(id)){return 'err'} // If anomalous behavior (where 'this' is window since this ignores any element calling this without an ID)
                if(gameData.objective){
                    if(id == gameData.objective.id){return 1} // If node is the objective
                    if(gameData.nodes[id].getOutgoingEffects().length === 0){return 2} // If node has no outgoing effects
                }
                if(playerInterventionCount >= playerInterventionMax){return 3}
                if(playerInterventionHistory.includes(id)){return 4}
                else return false;
            }
            if(invalidTarget()){return playerSelectedInvalidTarget(id, invalidTarget())} // If invalid ignore and alert player

            // Intervene on target
            interveneOnTrait(id);

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