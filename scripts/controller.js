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
function initialiseControls(gameData, leftPanel){

    // Panel close buttons
    addOnclickEvent('btn-x-leftPanel', function(){leftPanel.close();});

    // Add event to show information on-clicking nodes
    addOnclickEventsToNodes(gameData, leftPanel);
    
    // Path to objective button on the information panel 
    document.getElementById('panel-policy-showPathBtn').addEventListener("click", function(){
        try{highlightPath(document.getElementById('panel-policy-interventionBtn').getAttribute("data-nodeId"), gameData.objective.id)}catch{}
    });
            
    // Intervention button
    document.getElementById('panel-policy-interventionBtn').addEventListener("click", function(){
        
        // Increment the number of policies made
        playerInterventionCount ++;

        // Run propagation using gameData Graph object, this node's ID, and increase
        const thisNodeId = this.getAttribute('data-nodeId');
        runPropagation(gameData, this.getAttribute('data-nodeId'),  gameData.nodes[thisNodeId].prevalenceIncrease);

        // Update display
        updateTick();

        // If this is the third intervention then trigger the event for a player enacting a full policy
        if(playerInterventionCount == playerInterventionMax){playerMadePolicy()};

        // Close panel
        leftPanel.close();

    });

}

// Function to build clickable nodes
function addOnclickEventsToNodes(gameData, leftPanel){
    
    // Add onclick function to bring up node information
    d3.selectAll('g').on("click", function(){
        if(this.id){

            // Reset policy panel
            setHTML('policyEffects-decreases', null); setHTML('policyEffects-increases', null);

            // Find information on the selected node
            var node = gameData.nodes[this.id];
            const node_icon_src = this.childNodes[1].href.baseVal; // Get image href of this node's icon

            // Set left panel information
            setInformationPanel(node, gameData, node_icon_src);

            // Open node info panel 
            leftPanel.open(); 
        }
    })
}
