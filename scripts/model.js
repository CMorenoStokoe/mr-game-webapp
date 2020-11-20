/*

Data model
=========
Description: 
This is a high-level file which controls the data handling functions of the game.

Use:
This function is called by the main script, and calls functions in lower order files.

*/


/* Initialise data */


// Function to create data for the game
function initialiseData(nodes, edges, pValueThreshold){


    /* Filter and patch data */
        
        // Filter out edges above p value threshold
        var filteredEdges = filterByPval(edges, pValueThreshold);

        // Remove double negatives
        negateTrait(
            traitId='ukb_b_5076',
            newName='Socialisation',
            newIcon='social_chatBubble_alt', 
            nodes=nodes, edges=filteredEdges);
        

    /* Initialise DataClass */
    var gameData = new DataClass(nodes, filteredEdges); // Populate DataClass with gameData


    /* Configure node data */
    for(const [key, value] of Object.entries(gameData.nodes)){

        // Give node values
        gameData.nodes[key].average = nodeValues[key].prevalence;
        gameData.nodes[key].range = nodeValues[key].max - nodeValues[key].min;
        gameData.nodes[key].min = nodeValues[key].min;
        gameData.nodes[key].max = nodeValues[key].max;
        gameData.nodes[key].units = nodeValues[key].units;
        gameData.nodes[key].sd = nodeValues[key].SD;
        gameData.nodes[key].prevalenceUnlimited = nodeValues[key].prevalence;
        gameData.setPrevalenceValues(key, nodeValues[key].prevalence); // In data-classes

        // Calculate how much this node should increase as a result of an intervention
        gameData.nodes[key].prevalenceIncrease = standardise(gameData.nodes[key]).interventionUnitChange;

        // Give icon
        gameData.nodes[key].icon = `images/epicons/${icons[gameData.nodes[key].id]}.png`; // Icon assignment in gameData/icons.js
    
        // Give circle radius
        gameData.nodes[key].circleRadius = settings.nodes.circleRadius;

        // Reset values later set
        gameData.nodes[key].exaggeration = 0;

        // Record whether the node is good or bad (i.e., wellbeing is good but diabetes is bad)
        gameData.nodes[key].isGood = isGood[value.id];

        // Edges per node
        gameData.nodes[key].edges = []; // Init and fill from final data after filtering 
        
        // Utilities for categorising edges
        gameData.nodes[key].getOutgoingEffects = function(){return categoriseEdges(key, this.edges).outgoing};
        gameData.nodes[key].getIncomingEffects = function(){return categoriseEdges(key, this.edges).incoming};  
        
    }


    /* Configure edge data */
    for(const [key, value] of Object.entries(gameData.edges)){

        // Convert beta effect estimate to a % change in the outcome as a result of intervention
        const exposure = gameData.nodes[value['id.exposure']];
        const outcome = gameData.nodes[value['id.outcome']];

        // Calculate percent change in outcome relative to its prevalence value
        value.b_pct = exposure.prevalenceIncrease * value.b * standardise(outcome).prevalenceChangePerUnit;

        // Calculate percent change in outcome relative to its min-max value range
        value.b_pctOfRange = (exposure.prevalenceIncrease * value.b) / outcome.range * 100;
        
        // Update nodes' edge lists
        exposure.edges.push(value);
            exposure.edgeCount =  exposure.edges.length;
        outcome.edges.push(value);
            outcome.edgeCount =  outcome.edges.length;
    }    


    /* Simplify and validate data view */

        // Remove unused nodes from data
        for(const [key, value] of Object.entries(gameData.nodes)){
            if(!(value.edges.length>0)){
                delete gameData.nodes[key]; continue;
            };
        }

        
    /* Return final gameData */
        
        // Update graph data
        gameData.G = gameData.toG();

        // Remove loops from data network
        var loopsRemoved = 0;
        for(const node of gameData.G.nodes()){
            if(gameData.G.successors(node).length>0){
                
                // Find loops
                const loops = removeLoops(gameData.G, node);

                // Remove loops
                loopsRemoved += loops.length;
                gameData.G.removeEdgesFrom(loops);
                gameData.updateEdges(loops);

            }
        }
        
        // Return
        console.log('GAMEDATA: ', gameData, `${loopsRemoved} loops removed`);
        return(gameData);
}


// Remove double negatives for clarity
function negateTrait(traitId, newName, newIcon, nodes, edges){

    // Update nodes
    for(const node of nodes){
        if(node.id==traitId){
            node['label'] = newName; // Change name
        }
    }

    // Update edges
    for(const edge of edges){
        if(edge['id.exposure']==traitId){
            edge.b*=-1; // Flip betas
            edge['exposure'] = newName; // Change name
        }else if(edge['id.outcome']==traitId){
            edge.b*=-1; // Flip betas
            edge['outcome'] = newName; // Change name
        }
    }; 

    // Update icon and goodness records
    icons[traitId] = newIcon; // Update icon;
    isGood[traitId]= !isGood[traitId]; // Record trait as good

}

// Categorise edges into outgoing and incoming
function categoriseEdges(nodeId, edges){
    var incoming = [];
    var outgoing = [];

    // Categorise edges
    for(const edge of edges){
        if(nodeId == edge['id.outcome']){incoming.push(edge)}
        if(nodeId == edge['id.exposure']){outgoing.push(edge)}
    }

    // Return categorised edges
    return{incoming: incoming, outgoing: outgoing}
}