/* 

Test functions 
==============
Description:
This file contains tests used to test the propagataion algorithm's accuracy.
These functions are designed to automate tests to test that the expected values from functions match their
actual values. The Trémaux trees are used as tests of different networks.

Use:
These tests use the node/edge and Trémaux tree data to test the propagation algorithm.
Designed to be ran from a web page, with structured graph (SVG), text (p) and console
outputs as in test/propagation.html.

*/

// Test self-loop identification and removal
function test_selfloop(tree){

    try {
        var selfloops = tree.selfloopEdges(); // Identify

        if(selfloops.length == 0){;} // If no self loops found, state this for visibility
        else {
            tree.removeEdgesFrom(selfloops); // Remove selfloops if any are found
        }

        return({test: 'selfloop', status : 'Success', info: `Self loops: ${selfloops}`, selfloops: selfloops}); // Record in results
        
    }

    catch(err) { // fail
        return({test: 'selfloop', status : 'Fail', info: 'caught err'}); // Record in results
    }

}

// Test traversal algorithm
function test_traversal(tree){
    try {
        const path = DFS(tree,'A'); // Initiate DFS search of graph G object from root node 0                
        const pathTree = constructPathTree(path);
        return({test: 'traversal', status : 'Success', info: `${objSize(path.edges)} steps in path`, path: path, tree: pathTree}); // Record in results
    }

    catch(err) {
        return({test: 'traversal', status : 'Fail', info: 'caught err'}); // Record in results
    }

    // Construct tree of path taken
    function constructPathTree(path){

        var G = new jsnx.DiGraph(); // Initialise graph

        var i=0; const nodeOrder={}; // Initialise count and dictionary to track node orders

        // Get order of nodes
        for (const node of path.nodes){
            
            nodeOrder[node] = i; // Set node order by count
            const nodeColor = testDat.nodes[node].color// Get node color

            G.addNode(nodeOrder[node], {color: nodeColor}); // Add node to G
            i++; // Increment count
        }

        // Build edges with node order as their ID instead of their original name
        for (const edge of path.edges){

            // Get order of source and target nodes
            sourceID = nodeOrder[edge.source];
            targetID = nodeOrder[edge.target];

            // Add edges to G
            G.addEdge(sourceID,targetID);
        }

        return(G)
    }

}

// Test propagation MR algorithm
function test_propagation(path, graph){
    try {
        // Supply path for propagation
        result = propagate(graph, 'A', 1); // Run propagation MR
        for(const [key, value] of Object.entries(result)){result[key] = `${value}`}
        tree = constructPropagationTree(path, result);
        return({test: 'propagation', status : 'Success', info: result, tree: tree}); // Record in results
    }

    catch(err) {
        return({test: 'propagation', status : 'Fail', info: 'caught err'}); // Record in results
    }

    function constructPropagationTree(path, result){

        var G = new jsnx.DiGraph(); // Initialise graph
        
        // Replace node IDs with their change in prevalence from propagation
        for (const node of path.nodes){
            nodeLabel = '+' + result[node]
            G.addNode(node, {color: testDat.nodes[node].color, label: nodeLabel});
        }

        for (const edge of path.edges){
            G.addEdge(edge.source,edge.target, {label : '.5'})
        }

        return(G)
    }
}

// Method for writing results to DOM
function writeResults(results, id){
    html='';

    // Read in results and form text
    for (const result of results){
        test = result.test;
        status = result.status;
        info = JSON.stringify(result.info);
        var txtColor = 'red'
        
        if (status=='Success'){txtColor = 'green';}

        html += `<pre>${test}: <strong><span style=\"color: ${txtColor};\">${status} </strong><br>    ${info}</span><br></pre>`
    }
    
    setHTML(id, html); // Write to DOM
}

// Method for testing whether self loop removal worked
function checkSelfLoopsRemoved(){ // Test remove self loops
    for (const e of G_selfloop.edges()){
        if (e[0]+e[1] == 0){ // Test if any edges have the same source and target
            return false;
        } else {
            continue;
        }
    }
    return true;
}