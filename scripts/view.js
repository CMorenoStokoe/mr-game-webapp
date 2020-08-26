/*

View
====
Description: 
This file contains the scripts to produce the view for the game.

Use: 
This file is called by the main script and calls other functions in other secondary files.

*/

function initialiseView(gameData, pValueThreshold){

    // Set SVG height to fill window container
    svgContainerHeight = document.getElementById('svg-container').offsetHeight;
        document.getElementById('svg-main').setAttribute('height', svgContainerHeight);
    svgContainerWidth = document.getElementById('svg-container').offsetWidth;
        document.getElementById('svg-main').setAttribute('width', svgContainerWidth);

    // Initialise graph with pval = bonferroni, settings = mirana + settings.js modifications
    generateGraphFromJSON(gameData.toD3().nodes, gameData.toD3().links, '#svg-main', settings, pValueThreshold); 

    // Ensure objective is correctly set
    if(gameData.objective.good){
        setText('goal', `Raise ${gameData.objective.label}`);
    } else {
        setText('goal', `Lower ${gameData.objective.label}`);
    }    

    // Set progress towards goal
    setProgress('progress-goal', gameData.objective.change);
    
    // Have helper text on initialisation prompting the player to make an intervention
    setText('progress-helpText', `Enact policies to make progress.`);
    
}

// Update GUI
function updateView(gameData){
    
    // Ensure objective is correctly set
    setText('goal', `Raise ${gameData.objective.label}`);

    // Set progress towards goal
    setProgress('progress-goal', to4SF(gameData.objective.change_bar));

    // Remove helper text under policies
    setText('progress-helpText', ``);

    // Set node sizes
    setNodeSizes(gameData);
}

// Set node sizes
function setNodeSizes(gameData){

    for(const [key, value] of Object.entries(gameData.nodes)){

        // Get previous circle radius
        var previousRadius = value.circleRadius;

        // Mark whether node is increased ot decreased

        // Scale circle radius by how much this node's prevalence has changed
        var circleRadius = settings.nodes.circleRadius + (value.change / 100);

        // Clamp circle radius within minimum and maximum limits
        circleRadius = Math.min(settings.nodes.circleRadius_max, circleRadius);
        circleRadius = Math.max(settings.nodes.circleRadius_min, circleRadius);

        // Exaggerate tiny effect visuals for player satisfaction
        if(Math.abs((circleRadius += value.exaggeration) - previousRadius)<1){ // Add or remove node size to exaggerate small effects in either direction
            if(circleRadius - previousRadius > 0){value.exaggeration ++;};
            if(circleRadius - previousRadius < 0){value.exaggeration --;};
            circleRadius += value.exaggeration; // Carry over exaggerated sizes between interventions
        };

        // Update node's circle radius value for access by other methods
        value.circleRadius = circleRadius;

        // Scale node circle and icon size to prevalence
        d3.select(`#${key}`).select("circle").transition()
            .duration(500)
            .attr("r", circleRadius);
            
        d3.select(`#${key}`).select("image").transition()
            .duration(500)
            .attr("x", -circleRadius * 1)
            .attr("y", -circleRadius * 1)
            .attr("height", circleRadius * 2)
            .attr("width", circleRadius * 2);
    }
};


// Function to populate a panel with information about the current node
function setInformationPanel(node, gameData, node_icon_src){
    
    // Populate with node information
    setHTML('panel-policy-title', node.label); // Trait label
    setHTML('panel-policy-subtitle', ` 
        ${node.id} <br>
        Change: <br>
        ${to4SF(node.prevalence - node.average)} ${node.units} (${to4SF(node.change)}%)
    `); // Value
    document.getElementById('panel-policy-icon').src = node_icon_src; // Icon

    // Set data attribute for intervention
    document.getElementById('panel-policy-interventionBtn').setAttribute('data-nodeId', node.id);

    // Show information on the objective differently
    switch(node.id){

        // When clicking on the node which is the objective
        case gameData.objective.id:

            // Display incoming effects to the objective
            setHTML('policyEffects-title', 'Affected by:');
            
            incomingEdgeCount = 0;
            for(const edge of node.edges){
                
                // Color effects differently if it is an increase or decrease and append to a corresponding column in policy panel
                switch(edge['id.outcome']){

                    case node.id: incomingEdgeCount++;
                        
                        // Add text to policy effects detailing this relationship
                        if(Number(edge.b)<0){
                            createP(`policyEffect${edge.exposure}`, `${edge.exposure} <i class="fas fa-sort-down col-neg"></i>`, 'policyEffects-decreases');
                        } else if (Number(edge.b)>=0){
                            createP(`policyEffect${edge.exposure}`, `${edge.exposure} <i class="fas fa-sort-up col-pos"></i>`, 'policyEffects-increases');}
                    
                    default:
                        break;
                }
            }

            // If node has no effects, say this
            if(incomingEdgeCount==0){
                createP(`policyEffectNone-incr`, `- None -`, 'policyEffects-decreases', 'policyEffect-none');
                createP(`policyEffectNone-decr`, `- None -`, 'policyEffects-increases', 'policyEffect-none');
            }

            // Disable use of the intervention button
            document.getElementById('panel-policy-interventionBtn').disabled = true;
            document.getElementById('panel-policy-interventionBtn').className = 'btn btn-lg btn-dark';
            document.getElementById('panel-policy-interventionBtn').innerHTML = 'Cannot directly change this factor';

            // Hide show path to objective button
            setVisibility('panel-policy-showPathBtn', 'hidden');

            break;

        
        // When clicking on a node which is not the objective
        default:

            // Display outgoing effects from this edge
            setHTML('policyEffects-title', 'Effects:');

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

            // Enable use of the intervention button
            document.getElementById('panel-policy-interventionBtn').disabled = false;
            document.getElementById('panel-policy-interventionBtn').className = 'btn btn-lg btn-primary';
            document.getElementById('panel-policy-interventionBtn').innerHTML = 'Enact policy';

            // Show path to objective button
            setVisibility('panel-policy-showPathBtn', 'visible');
            
            break;
    }

    
}

// Highlight nodes in path
function highlightPath(source, target){
    const path = jsnx.bidirectionalShortestPath(gameData.G, source, target);    

    for (i = 0; i < path.length; i++) {
        if(i+1 == path.length){break;}

        // Construct edges from node path
        const edge = gameData.edges[gameData.getEdgeId(path[i], path[i+1])];
        const startingLineWidth = d3.select(`#edge_${edge.id}`).attr("stroke-width");

        // Animate edges in path
        d3.select(`#edge_${edge.id}`)
            .transition()
            .duration(2000)
            .attr("stroke-width", startingLineWidth*1 + 10);
        setTimeout(function(){ 
            d3.select(`#edge_${edge.id}`)
                .transition()
                .duration(2000)
                .attr("stroke-width", startingLineWidth);
        }, 2000);
    }
}

// Significant figures function
function to4SF(number){
    const absoluteValue = Math.abs(number); // Get the absolute value
    console.log(number, absoluteValue)
    if (absoluteValue == 0){
        return number.toFixed(0)
    } else if (absoluteValue < 0.0001){
        return number.toFixed(5)
    } else if(absoluteValue < 0.001){
        return number.toFixed(4)
    } else if(absoluteValue < 0.01){
        return number.toFixed(3)
    } else if(absoluteValue < 0.1){
        return number.toFixed(2)
    } else if(absoluteValue < 1){
        return number.toFixed(1)
    } else if(absoluteValue < 10){
        return number.toFixed(1)
    } else if(absoluteValue < 100){
        return number.toFixed(0)
    } else {
        return number.toFixed(0)
    }

}
