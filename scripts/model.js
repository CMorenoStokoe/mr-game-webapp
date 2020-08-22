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

    // Prepare nodes for visualisation
    for(const [key, value] of Object.entries(gameData.nodes)){
        
        // Filter list of related edges and remove node if not part of the network
        gameData.nodes[key].edges = filterByPval(gameData.nodes[key].edges, pValueThreshold);
        if(!(gameData.nodes[key].edges.length>0)){
            delete gameData.nodes[key]; continue;
        };

        // Remove self loops from list of edges
        gameData.nodes[key].edges = removeSelfloopEdges( gameData.nodes[key].edges);

        // Give prevalence
        gameData.nodes[key].prevalence = 1;

        // Give icon
        gameData.nodes[key].icon = `https://www.morenostok.io/epicons/svg/${icons[gameData.nodes[key].id]}.svg`; // Icon assignment in gameData/icons.js
    }

    // Detect loops
    //findLoops(gameG, 0, recursionLimit = 10)
    
    // Choose an objective target
    gameData.setObjective();

    console.log(gameData);
    return(gameData);

}