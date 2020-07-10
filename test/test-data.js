/* 

Test data
=========
Description: 
This file contains the node and edge properties for the propagation test page

Use: 
This data is the basic node and edge information used by the Trémaux tree script. 
I.e., the Rrémaux trees are compiled by combining these nodes and edges.

*/

// Set up dataClass containing node and edge information

n = { // Dictionary of nodes and their colors
    A:['A', {color: '#8dd3c7'}], 
    B:['B', {color: '#ffffb3'}], 
    C:['C', {color: '#bebada'}], 
    D:['D', {color: '#80b1d3'}], 
    E:['E', {color: '#fdb462'}], 
    F:['F', {color: '#b3de69'}], 
    G:['G', {color: '#fccde5'}],
    H:['H', {color: '#d9d9d9'}], 
    I:['I', {color: '#bc80bd'}], 
    J:['J', {color: '#ccebc5'}], 
    K:['K', {color: '#ffed6f'}],
}
nodeData_test = [];
edgeData_test = [];
nodeIDs = ['A','B','C','D','E','F','G','H','I','J','K'];
for (i = 0; i < 10; i++){ // generate node data
        nodeData_test.push({id: nodeIDs[i]});
    for (j = 0; j < 10; j++){ // generate link data
        edgeData_test.push({id: [nodeIDs[i],nodeIDs[j]], source:nodeIDs[i], target:nodeIDs[j], b:0.5, label: 'ß=1'});
    }
}

// Enter test data into custom pseudo DataClass object which formats data for use
var testData = new DataClass(nodeData_test, edgeData_test)