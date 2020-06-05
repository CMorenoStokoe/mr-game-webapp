/*

Propagation MR
==============

Description
-----------
This script is designed to calculate the propagating effects of 
changing a precursor node's value by changing the successor node's
value by the edge beta weight.

Javascript fuzzy number representation
--------------------------------------
Since Javascript represents numbers using binary base 2, very large
and very small numbers with lots of decimal places are not represented
accurately. To solve this, the Big.js dependency is used which has
Big number classes which represent numbers accurately in binary base 10.
Multiplication and addition are accurate using this method, although division
is still liable to inaccuracy.

*/

// Keep track of: constants, old val, new val

// path, dx/y0/b, 

// Returns value of successor node Y given change to precursor node X and edge weight beta
function propagationMR(deltaX, y0, b){

    // Convert delta, starting node value and edge beta to big numbers
    deltaX = new Big(deltaX);
    y0 = new Big(y0);
    b = new Big(b);

    // Calculate propagation effects and final prevalence of target node (y1)
    y1 = y0.plus(b.times(deltaX));

    console.log(y1.gt(y0))

    return y1.valueOf();
}