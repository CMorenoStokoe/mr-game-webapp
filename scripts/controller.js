/*

Controller
=========
Description:
This file contains the functions to create the controls for the game

Use:
It is called by the main script and calls other secondary functions.

*/

function initialiseControls(gameData, leftPanel){

    // Panel close buttons
    addOnclickEvent('btn-x-leftPanel', function(){leftPanel.close();});

    // Add event to show information on-clicking nodes
    addOnclickEventsToNodes(gameData, leftPanel);

    // Intervention button
    
    document.getElementById('panel-policy-interventionBtn').addEventListener("click", function(){
        
        // Increment the number of policies made
        playerInterventionCount ++;

        // Run propagation using gameData Graph object, this node's ID, and increase
        thisNodeId = this.getAttribute('data-nodeId');
        prevalenceIncrease = Math.abs(gameData.nodes[thisNodeId].prevalence * 0.25);
        runPropagation(gameData, this.getAttribute('data-nodeId'), prevalenceIncrease);

        // If this is the third intervention then trigger the event for a player enacting a full policy
        if(playerInterventionCount == 3){playerMadePolicy()};

        updateTick();

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

            // Populate with node information
            const title = document.getElementById('panel-policy-title') ;
                title.innerHTML = node.label;
            const subtitle = document.getElementById('panel-policy-subtitle');
                subtitle.innerHTML = node.id;
            const icon = document.getElementById('panel-policy-icon');
                icon.src = this.childNodes[1].href.baseVal; // Get image href of this node's icon

            // Set data attribute for intervention
            const dataAttr = document.getElementById('panel-policy-interventionBtn');
                dataAttr.setAttribute('data-nodeId', node.id);

            // Display outgoing effects from this edge
            outGoingEdgeCount = 0;

            for(const edge of node.edges){
                
                // Color effects differently if it is an increase or decrease and append to a corresponding column in policy panel
                switch(edge['id.exposure']){

                    case node.id: outGoingEdgeCount++;
                        
                        // Add text to policy effects detailing this relationship
                        if(Number(edge.b)<0){
                            createP(`policyEffect${edge.outcome}`, `${edge.outcome} <i class="fas fa-sort-down col-neg"></i>`, 'policyEffects-decreases');
                        } else if (Number(edge.b)>=0){
                            createP(`policyEffect${edge.outcome}`, `${edge.outcome} <i class="fas fa-sort-up col-pos"></i>`, 'policyEffects-increases');}
                    
                    default:
                        break;
                }
            }
            
            // If node has no effects, say this
            if(outGoingEdgeCount==0){
                createP(`policyEffectNone-incr`, `- None -`, 'policyEffects-decreases', 'policyEffect-none');
                createP(`policyEffectNone-decr`, `- None -`, 'policyEffects-increases', 'policyEffect-none');
            }
            
            // Open node info panel 
            leftPanel.open(); 
        }
    })
}