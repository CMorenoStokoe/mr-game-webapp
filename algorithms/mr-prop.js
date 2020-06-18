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
function propagate(path, nodeData, edgeData){
    results = [];
    changes = {};

    firstCycle = true;

    // Extract the data required for propagation MR from the propagation path and MR data (PropMRData bundle)
    for (const edge of PropMRData){

        // Change in prevalence to first node to initiate propagating effects (labelled deltaX0)
        deltaXStart='0.00000000000000000000000000000015678' // FIX: Needs to be set dynamically
        /*
        console.log('edge.yID',edge.yID)
        console.log('edge.xID',edge.xID)
        console.log('changes[edge.xID]',changes[edge.xID])
        if(firstCycle){deltaXValue = deltaXStart; firstCycle = false} else {deltaXValue = changes[edge.xID]};*/
        deltaXValue = deltaXStart
        
        // Convert delta, starting node value and edge beta to big numbers (40 decimal place accuracy)
        const deltaX = new Big(deltaXValue); // change in prevalence (delta) of source node (x, precursor in path)
        const y0 = new Big(edge.y0); // initial prevalence of target node (y0, successor in path)
        const b = new Big(edge.b); // beta weight of edge from source to target node (b)
        
        // Calculate propagation effects and final prevalence of target node (y1)
        const y1 = propagationMR(deltaX, y0, b);

        // Record result as entry in results output dictionary
        results[edge.yID]=y1.valueOf();

        // Calculate the change in y as a result of propagation
        const deltaY = diff(y0, y1);

        // Save deltaY for use as deltaX in next propagation cycle since for A -> B -> C to calculate B -> C we need to know deltaB
        changes[edge.yID]= deltaY.valueOf();
        //console.log('changes[edge.yID]',changes[edge.yID])
        //fixme, multipe deltaYs to propagate
        
        //console.log(edge.xID, ' changed ', edge.yID, ' (', y0 , '-->', y1, ')');
    }

    // Return results once propagation finished
    return(results)


    // Method returns value of successor node Y given change to precursor node X and edge weight beta
    function propagationMR(deltaX, y0, b){

        // Calculate propagation effects and final prevalence of target node (y1)
        y1 = y0.plus(b.times(deltaX));

        return y1;
    }


    // Method calculates the change between y0 and y1 (as Big number classes)
    function diff(y0, y1){

        // Discover which number y0 or y1 is larger & order in size
        const nLarger = orderBySize(y0, y1)[0];
        const nSmaller =  orderBySize(y0, y1)[1];
        
        // Discover if numbers are negative
        const y0IsNeg = isNegative(y0);
        const y1IsNeg = isNegative(y1);
        
        // Return the difference between y0 and y1
        difference = compare();
        return(difference);

        // Returns two numbers in order of size (e.g., 1,0)
        function orderBySize(n1, n2){
            switch(n1.gt(n2)){
                case true: // y0 > y1
                    return([n1,n2])
                case false: // y0 < y1
                    return([n2,n1])
            }
        }

        // Returns whether numbers are negative{
        function isNegative(n){
            switch(n.lt(0)){
                case true:
                    return true;
                case false:
                    return false;
            }
        }

        // Compare two numbers and return the difference given two numbers in order of (larger number, smaller number)
        function compare(){
            
            // Do arithmetic differently depending on if numbers are negative
            switch(y0IsNeg){
                case true:

                    switch(y1IsNeg){

                        // If both numbers are negative
                        case true:
                            
                            // Negate both numbers and subtract
                            return nLarger.times(-1).minus(nSmaller.times(-1));
                        
                        // If only one number is negative     
                        case false:
                            
                            // Add together (smaller number must be the negative one)
                            return nLarger.plus(nSmaller);
                    }
                
                // If neither number is negative
                case false:

                    // If neither numbers are negative: subtract
                    return nLarger.minus(nSmaller);

            }
        }
    }

}
