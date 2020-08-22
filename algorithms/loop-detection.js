/*

Description
-----------
The purpose of this script is to detect loops in a manner generalisable to many complex and different networks

*/

// Discover bidirectional nodes 
/*
function findBidirectionals(graph){
    for(const node of graph.nodes){
        for(edge of node.edges){
            if()
        }
    }
}*/

/*
// Discover loops
function findLoops(graph, root){
    console.log('Starting Loop search, max recursions = ', recursionLimit, Math.pow(graph.numberOfNodes(), 2))

    // Initialise search queue
    const queue = [{source: 'start', target: root}];

    for (i = 0; i < Math.pow(graph.nodes().length, 2); i++){ // failsafe

        // Search network until queue empty
        if(queue[0] == undefined){console.log('DFS search finished.');break;} // failsafe

        // Current edge to search
        const currentEdge = queue[0]; //.target node is the node currently being searched

    }

}*/


/* Discover loops - old
function findLoops(graph, root, recursionLimit = 10){
    console.log('Starting Loop search, max recursions = ', recursionLimit, Math.pow(graph.numberOfNodes(), 2))

    // Initialise search queue
    const queue = [{source: 'start', target: root}];
    const visits = {};
    var loopHolder = null;
    const loops = [];

    for (i = 0; i < Math.pow(graph.nodes().length, 2); i++){ // failsafe
        
        // Search network until queue empty
        if(queue[0] == undefined){console.log('DFS search finished.');break;} // failsafe

        // Current edge to search
        const currentEdge = queue[0]; //.target node is the node currently being searched
        
        console.log('#### searching node: ', currentEdge.target);

        // Shift item from queue
        queue.shift();

        console.log('queue: ', queue);

        // Track and mark edge visits
        switch(visits[currentEdge]){

            case recursionLimit:// If edge at recursionLimit of visits
                
                loopHolder = currentEdge; // Store edge as previous loop in edge
                console.log('%cVisited 10, recording edge: [' + loopHolder.source + ',' + loopHolder.target  + ']', 'color:red');
                continue;
            
            case undefined: // If edge not visited before
                console.log('not visited, count=1', visits[currentEdge]);
                visits[currentEdge]=1; // Initialise visit count for this edge with 1

                findSuccessors();
                break;

            default: // If edge visited before but not at recursionLimit
                console.log('visited but <10, count++', visits[currentEdge]);
                visits[currentEdge]++; // Increment edge visit count

                findSuccessors();
                break;
        }

        // Discover if any loop edges are the terminus
        if (loopHolder != null){ // If there is a currently held unrecorded loop edge
            console.log('%cif (loopHolder)', 'color: purple')
            if (loopHolder != currentEdge){ // If current edge is not the current loop edge under investigation
                if (currentEdge.source != loopHolder.target){ // If previous edge does not connect to current edge
                    console.log('%cLoop terminus found: ', 'color:green', loopHolder.source);
                    loops.push(loopHolder.source); // Add previous edge to list of edges in loops
                    loopHolder = null; // Reset loop holder
                }
            }
        }

        // Add successor nodes to search queue
        function findSuccessors(){
            for (successor of graph.successors(currentEdge.target)){ // Get all successor nodes of current node
                
                queue.unshift({ // Add dictionary entry for succeeding edge {source: current node, target: successor node}
                    source : currentEdge.target, 
                    target : successor
                }); 
            };
        }
    }
    
    console.log('Loop search finished.');
    console.log('visits', visits);
    console.log('loops', loops);

} */
