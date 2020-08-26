/*

Data model
=========
Description: 
This is a high-level file which controls the data handling functions of the game.

Use:
This function is called by the main script, and calls functions in lower order files.

*/

// Function to create data for the game
function initialiseData(nodes, edges, pValueThreshold){

    // Filter out edges above p value threshold
    var filteredEdges = filterByPval(edges, pValueThreshold);

    // Filter out self loop edges
    filteredEdges = removeSelfloopEdges(filteredEdges);

    // Populate DataClass with gameData
    var gameData = new DataClass(nodes, filteredEdges); // Payload: nodes, edges

    // Set value by which an intervention changes a trait
    gameData.interventionStrength = 0.05;

    // Prepare nodes for visualisation
    for(const [key, value] of Object.entries(gameData.nodes)){
        
        // Filter list of related edges and remove node if not part of the network
        gameData.nodes[key].edges = filterByPval(gameData.nodes[key].edges, pValueThreshold);
        if(!(gameData.nodes[key].edges.length>0)){
            delete gameData.nodes[key]; continue;
        };

        // Convert betas for edges listed under this node to percentage effects
        convertBetasToPctEffects(gameData.nodes[key].edges);

        // Remove self loops from list of edges
        gameData.nodes[key].edges = removeSelfloopEdges( gameData.nodes[key].edges);

        // Give node values
        gameData.nodes[key].average = nodeValues[key].prevalence;
        gameData.nodes[key].range = nodeValues[key].max - nodeValues[key].min;
        gameData.nodes[key].min = nodeValues[key].min;
        gameData.nodes[key].max = nodeValues[key].max;
        gameData.nodes[key].units = nodeValues[key].units;
        gameData.setPrevalenceValues(key, nodeValues[key].prevalence); // In data-classes

        // Calculate how much this node should increase as a result of intervention
        gameData.nodes[key].prevalenceIncrease = gameData.nodes[key].average * gameData.interventionStrength;

        // Give icon
        gameData.nodes[key].icon = `https://www.morenostok.io/epicons/svg/${icons[gameData.nodes[key].id]}.svg`; // Icon assignment in gameData/icons.js
    
        // Give circle radius
        gameData.nodes[key].circleRadius = settings.nodes.circleRadius;

        // Reset values later set
        gameData.nodes[key].exaggeration = 0;

        // Record whether the node is good or bad (i.e., wellbeing is good but diabetes is bad)
        gameData.nodes[key].good = isGood[value.id];
        
    }

    // Prepare edges for visualisation
    convertBetasToPctEffects(gameData.edges);
    
    // Calculate % effects for each edge
    function convertBetasToPctEffects(edges){

        for(const [key, value] of Object.entries(edges)){

            // Convert beta effect estimate to a % change in the outcome as a result of intervention
            const exposure = gameData.nodes[value['id.exposure']];
            const outcome = gameData.nodes[value['id.outcome']];

            value.b_pct = (exposure.prevalenceIncrease * value.b) / outcome.range * 100;
            console.log(value.b_pct)
        }

    }

    // Make Graph object
    gameData.G = gameData.toG();

    // Detect loops
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
    
    // Choose an objective target
    gameData.setObjective();

    // Return gameData
    console.log(`${loopsRemoved} loops removed`);
    console.log('GAMEDATA: ', gameData);
    
    return(gameData);

}
