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

nodeInfo = { // Dictionary of nodes and their colors
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
        nodeData_test.push({id: nodeIDs[i], color: nodeInfo[nodeIDs[i]][1].color, prevalence: '1'});
    for (j = 0; j < 10; j++){ // generate link data
        edgeId=''+nodeIDs[i]+'_to_'+nodeIDs[j]
        edgeData_test.push({id: edgeId, source:nodeIDs[i], target:nodeIDs[j], b:'0.5', label: 'ß=1'});
    }
}

// Enter test data into custom pseudo DataClass object which formats data for use
var testDat = new DataClass(nodeData_test, edgeData_test)  

// Method for getting test data
function getTestDataInfo(edges){
    nodes=[] // Get nodes from edge list
    for(const edge of edges){
        source=edge[0];
        target=edge[1];
        if(!(nodes.includes(source))){nodes.push(source)};
        if(!(nodes.includes(target))){nodes.push(target)};
    }
    
    return({ // Get node and edge information from data class
        nodes: lookupMultiple(nodes, 'node', testDat),
        edges: lookupMultiple(edges, 'edge', testDat),
    })

    // Returns node and edge information from DataClass by IDs
    function lookupMultiple(items, type, database){
        
        const list=[]
        for (const item of items){
            list.push(lookup(item, database))
        }
        return(list)
    
        function lookup(item, database){
            if(type=='node'){
                return(testDat.nodes[item]);
            }
            if(type=='edge'){
                id=''+item[0]+'_to_'+item[1];
                return(testDat.edges[id]);
            }
        }
    }
}