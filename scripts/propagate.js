/* 

Propagation
==============
Description:
This file contains the main propagation method for simulating virtual intervention effects.

Use:
This file invokes the propagation and traversal algorithms to produce propagation result.

*/

function runPropagation(gameData, originNode, valueChange){
    
    // Get data network graph object to search
    network = gameData.G

    // Find traversal path
    const path = DFS(network, originNode);

    // Follow traversal path in propagation
    const result = propagate(network, originNode, valueChange);

    // Update values with propagation effects
    for(const [key, value] of Object.entries(result)){
        gameData.nodes[key].prevalence += value;
        console.log([key, value], gameData.nodes[key], gameData.nodes[key].prevalence)
    }

    // Return the result of nodes to change
    console.log(`Propagated the effect of changing ${originNode} by ${valueChange} with results: `, result)
    return(result);
}