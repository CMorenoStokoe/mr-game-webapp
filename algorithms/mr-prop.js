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
is still liable to inaccuracy.

*/

// Propagation method
function propagate(path, nodeData, edgeData, origin){
    results = [];
    changes = origin; // Array of {node id: value change} dictionaries containing changes to nodes during propagation. Start with origin and initial change

    // Extract the data required for propagation MR from the propagation path and MR data (PropMRData bundle)
    for (const edge of path){
        
        // Construct edge ID from source and target nodes in edge
        key = [edge.source,edge.target]

        // Convert delta, starting node value and edge beta to big numbers (40 decimal place accuracy)
        const deltaX = new Big(changes[edge.source]); // change in prevalence (delta) of source node (x, precursor in path)
        const b = new Big(edgeData[key].b); // beta weight of edge from source to target node (b)
        
        // Calculate propagation effects and final prevalence of target node (y1)
        const deltaY = propagationMR(deltaX, b);

        // Save deltaY for use as deltaX in next propagation cycle since for A -> B -> C to calculate B -> C we need to know deltaB
        if(changes[edge.target] == undefined){
            changes[edge.target] = deltaY.valueOf(); // Get total delta
            console.log('change initialised', changes[edge.target])
        } else {
            const totalDeltaY = new Big(changes[edge.target]); // Get total delta Y
            changes[edge.target] = totalDeltaY.plus(deltaY).valueOf(); // Add to delta
            console.log('change updated', changes[edge.target])
        }
    
    }

    // Return results once propagation finished
    return(changes)


    // Method returns value of successor node Y given change to precursor node X and edge weight beta
    function propagationMR(deltaX, b){

        // Calculate propagation effect (deltaY)
        deltaY = b.times(deltaX);

        return deltaY;
    }

}
