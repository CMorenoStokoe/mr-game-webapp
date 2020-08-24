/*

Propagation MR
==============

Description
-----------
This script is designed to calculate the propagating effects of 
changing a precursor node's value by changing the successor node's
value by the edge beta weight.

Arguments
-----------
path = (Array) Edges in order of path to follow
nodeData = (Dictionary) Properties of nodes in network including current value
edgeData = (Dictionary) Properties of edges in network including betas and current values

Javascript fuzzy number representation
--------------------------------------
Since Javascript represents numbers using binary base 2, very large
and very small numbers with lots of decimal places are not represented
accurately. To solve this, the Big.js dependency is used which has
Big number classes which represent numbers accurately in binary base 10.
Multiplication and addition are accurate using this method, although division
is still liable to inaccuracy. Currently disabled.

*/


// Propagation method
function propagate(graph, root, valueChange){

    // Init propagation queue
    const queue = [root];

    // Initialise object containing the results of propagation
    const prevalence = {};
        for(const node of graph.nodes()){prevalence[node] = {}}; // Init all node values with 0 at start
        prevalence[root] = {root: valueChange}; // Set origin node value to be the value change to propagate through network

    // Run search with failsafes to avoid infinite loops
    for (i = 0; i < Math.pow(graph.nodes().length, 2); i++){ 
        if(queue[0] == undefined){break;}

        // Add successors of current node to queue
        for(const successor of graph.successors(queue[0])){queue.push(successor)};

        // Calculate propagation effect from predecessors
        for(const predecessor of graph.predecessors(queue[0])){
            
            // Get Beta weight to incoming change
            const b = getEdgeBeta([predecessor, queue[0]]); // 

            // Calculate total incoming change from previous node
            let deltaX = 0; 

            for(const [key, value] of Object.entries(prevalence[predecessor])){
                deltaX += value;
            };

            // Calculate change to node from this predecessor
            var deltaY = b*deltaX;

            // Update node prevalence
            prevalence[queue[0]][predecessor] = deltaY;
        }
        
        // Remove current item from queue
        queue.shift();

    }

    // Add up changes to nodes
    results = {};
    for(const [key1, value1] of Object.entries(prevalence)){
        
        var prev = 0;
        for(const [key2, value2] of Object.entries(prevalence[key1])){
            prev = Number(prev + value2);
        }
        
        // If a node value changed add it to results
        if(prev!=0){results[key1] = prev;}
        
    }

    return(results);

    // Function to return edge beta weights
    function getEdgeBeta(edge){

        for([key, value] of jsnx.getEdgeAttributes(graph, 'b').entries()){
            if(key[0] == edge[0] && key[1] == edge[1]){return(value)};
        }

    }
}
