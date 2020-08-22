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
function propagate(path, origin, valueChange){
    console.log('propagate called: ', path,origin,valueChange)
    results = [];
    changes = {}; // Array of {node id: value change} dictionaries containing changes to nodes during propagation
    changes[origin]=valueChange // Start by recording the value change to propagate and the origin node which will be propagated from

    // Extract the data required for propagation MR from the propagation path and MR data (PropMRData bundle)
    for (const edge of path){
        console.log(changes[origin])
        // Convert values to big numbers (for 40 decimal place accuracy)
        const deltaX = new Big(changes[edge.source]); // change in prevalence (delta) of source node (x, precursor in path)
        const b = new Big(edge.b); // beta weight of edge from source to target node (b)
        
        // Calculate propagation effect
        const deltaY = b.times(deltaX); 

        // Save deltaY for use as deltaX in next propagation cycle since for A -> B -> C to calculate B -> C we need to know deltaB
        if(changes[edge.target] == undefined){
            changes[edge.target] = deltaY.valueOf(); // Get total delta
        } else {
            const totalDeltaY = new Big(changes[edge.target]); // Get total delta Y
            changes[edge.target] = totalDeltaY.plus(deltaY).valueOf(); // Add to delta
        }
    }

    // Return results once propagation finished
    console.log(`Propagated +${valueChange} ${origin}. Results:`, changes);
    return(changes)
}

// Propagation method
function propagate(path, origin, valueChange){
    console.log('propagate called: ', path,origin,valueChange)
    results = [];
    changes = {}; // Array of {node id: value change} dictionaries containing changes to nodes during propagation
    changes[origin]=valueChange // Start by recording the value change to propagate and the origin node which will be propagated from

    // Extract the data required for propagation MR from the propagation path and MR data (PropMRData bundle)
    for (const edge of path){
        console.log(changes[origin])
        // Convert values to big numbers (for 40 decimal place accuracy)
        const deltaX = new Big(changes[edge.source]); // change in prevalence (delta) of source node (x, precursor in path)
        const b = new Big(edge.b); // beta weight of edge from source to target node (b)
        
        // Calculate propagation effect
        const deltaY = b.times(deltaX); 

        // Save deltaY for use as deltaX in next propagation cycle since for A -> B -> C to calculate B -> C we need to know deltaB
        if(changes[edge.target] == undefined){
            changes[edge.target] = deltaY.valueOf(); // Get total delta
        } else {
            const totalDeltaY = new Big(changes[edge.target]); // Get total delta Y
            changes[edge.target] = totalDeltaY.plus(deltaY).valueOf(); // Add to delta
        }
    }

    // Return results once propagation finished
    console.log(`Propagated +${valueChange} ${origin}. Results:`, changes);
    return(changes)

}
