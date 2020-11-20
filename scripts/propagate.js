/* 

Propagation
==============
Description:
This file contains the main propagation method for simulating virtual intervention effects.

Use:
This file invokes the propagation and traversal algorithms to produce propagation result.

*/

// Simulate the effects of an intervention
function runPropagation(gameData, originNode, valueChange){
    
    // Get data network graph object to search
    var network = gameData.G;

    // Apply algorithms

        // Find traversal path
        const path = DFS(network, originNode);

        // Follow traversal path in propagation
        const result = propagate(network, originNode, valueChange);

    // Update values
    gameData.update(result); // data-classes.js

    // Return results
    console.log(`Propagated the effect of changing ${originNode} by ${valueChange} with results: `, result)
    return({path: path, result: result});
}

// Find the optimal trait(s) to intervene on to effect a target
function propagateEvE(gameData){
    // Init results variable
    var results = {};
    
    // Get data network graph object to search
    var network = gameData.G;
    
    // Run intervention simulations for each node in network
    for(const [id, node] of Object.entries(gameData.nodes)){

        // Simulate intervention

            // Get value by which to change trait in intervention
            const prevalenceIncrease = node.isGood ? node.prevalenceIncrease : -node.prevalenceIncrease; // If good increase, if bad reduce

            // Find traversal path
            const path = DFS(network, id);

            // Follow traversal path in propagation
            const result = propagate(network, id, prevalenceIncrease);

            // Append to results
            results[id] = {results: result, path: path}
    }

    // Return results
    return(results);
}