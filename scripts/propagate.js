/* 

Propagation
==============
Description:
This file contains the main propagation method for simulating virtual intervention effects.

Use:
This file invokes the propagation and traversal algorithms to produce propagation result.

*/

function runPropagation(network, originNode, valueChange){
    console.log('Propagate invoked: ', network, originNode, valueChange)

    // Remove any self-loops 
    selfloops = network.selfloopEdges();
    network.removeEdgesFrom(selfloops); 
    
    // Remove any loops 
    //network.removeEdgesFrom(network.loopEdges());

    // Find traversal path
    const path = findPropagationPath(network, originNode);

    // Follow traversal path in propagation
    const result = propagate(path.edges, originNode, valueChange);

    // Update values with propagation effects
    for(const node of path.nodes){
        network.node.get(node).prevalence = result[node];
    }

    // Return the result of nodes to change
    console.log('Propagation complete: ', network.nodes(optData=true))
    return(result);
}