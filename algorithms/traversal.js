/* 
Depth-First Search Traversal Variant
`One step forward two steps back`
============================
Description: 
1. Get node n from queue 
2. Check if all predecessor nodes of n have already been searched exhaustively
    3. If not, travel backwards and search all predecessor nodes (and their predecessors..)
    4. Break if a loop is found (i.e., a node searching its predecessors finds itself)
5. Add successors of node n to queue
6. Continue until all nodes have been exhausted (predecessor nodes exhaustively searched)

Comparison to BFS and DFS
------------------------
The implementation of depth-first search (DFS) is differentiated from bredth-first search (BFS) by implementing a queue system and adding new 
new nodes to the front of this queue. This results in nodes being explored 'depth-first' by following a node's path until it ends.
Bredth-first however searches nodes in the order they are discovered.

Example:
a - b 
a - c
b - d

DFS will search this network in this order: a-b, b-d, a-c
BFS will search this network in this order: a-b, a-c, b-d

This algorithm is  suited to avoiding loops because it follows a path until exhaustion, so can use this to remember the 
route and avoid visiting nodes it has visited before.

Critically, this variant of DFS is different however, in that it will back track when a node's predecessors haven't been fully searched yet.
This allows a propagation network to follow its path and accurately update values of nodes by changes in their predecessors.

*/

// Discover loops
function findLoops(graph, root, recursionLimit = 10){
    console.log('Starting Loop search, max recursions = ', recursionLimit, Math.pow(graph.numberOfNodes(), 2))

    // Initialise search queue
    const queue = [{source: 'start', target: root}];
    const visits = {};
    var loopHolder = null;
    const loops = [];

    console.log(graph, root, queue)
    console.log('gnodes',graph.numberOfNodes())
    

    for (i = 0; i < Math.pow(graph.nodes().length, 2); i++){ // failsafe
        
        // Search network until queue empty
        if(queue[0] == undefined){console.log('DFS search finished.');break;} // failsafe
        //if(queue[0] == undefined){

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
            // Add successors to front of queue


    }
    
    console.log('Loop search finished.');
    console.log('visits', visits);
    console.log('loops', loops);

}

// Run 'Two steps forward one step back" depth-first search variant
function DFS(graph, root){
    console.log('Starting DFS search, max iterations = ', Math.pow(graph.numberOfNodes(), 2))

    // Initialise queue, exhaustedNodes and path lists
    const queue = [root]; // Add root node to search queue
    const exhaustedNodes = {root : true,}; // Memory of nodes already travelled exhaustively
    const path = []; // Paths taken through nodes from origin

    // Run DFS variant
    for (i = 0; i < Math.pow(graph.nodes().length, 2); i++){ 
        /* 
        Failsafes
            1. Maximum number of iterations (n nodes ^2) to avoid infinite loops (above)
            2. Search while the queue is not empty  to avoid runtime error when queue is emptied (below)
        */
        if(queue[0] == undefined){console.log('DFS search finished.');break;}

        // 1. Get node n from queue 
        const currentNode = queue[0];

        console.log('searching ', currentNode, ' (exhausted ', exhaustedNodes, ' queue: ', queue, ')')

        // 2. Check if node is exhaustible (if all precursors are exhausted)
        exhaustible = exhaustedPredecessors(currentNode);
        
        // 3. If precursors are exhausted
        if(exhaustible){
            console.log('exhaustible')

            // Set node exhausted
            exhaustedNodes[currentNode] = true;

            // Remove node from queue 
            queue.shift();
            
            // Add exhausted node to path
            path.push(currentNode); 

            // Add successors of node n to queue
            for (successor of unExhaustedSuccessors(currentNode)){ queue.unshift(successor); };
        }

        // 3. If node not exhausted skip for now and come back to later when predecessors are exhausted
        if(!(exhaustible)){
            //console.log('unexhaustible')
            
            // Move node to back of queue 
            queue.shift();
            queue.push(currentNode);
            
            // Add unexhausted predecessors to front of queue
            for (predecessor of unExhaustedPredecessors(currentNode)){ queue.unshift(predecessor); };

        }

        //     4. Break if a loop is found (i.e., a node searching its predecessors finds itself)

        // 6. Continue until all nodes have been exhausted (predecessor nodes exhaustively searched)
        continue;
    }
    // 7. Return order of nodes to explore in order to fully explore network as 
    return(path); // Array of arrays containing edges to follow in order ([[a,b],[b,c]])

    // Exhaustion control 
    function exhaustedPredecessors(node){ 
        
        // Return false if any edge is in exhaustion exhaustedNodes stack
        for (predecessor of graph.predecessors(node)){
            if (predecessor in exhaustedNodes){continue;}else{return false;}
        }; return true;

    }
    
    // Return any unexhausted predecessors
    function unExhaustedPredecessors(node){ 
        unexhausted = [];

        // Check whether each predecessor is exhausted
        for (predecessor of graph.predecessors(node)){
            if (predecessor in exhaustedNodes){
                // Skip exhausted predecessors
                continue;
            }else{
                // If not exhausted then add to list to return
                unexhausted.push(predecessor);
            }
        }; 
        
        return unexhausted;
    }

    // Return any unexhausted successors
    function unExhaustedSuccessors(node){ 
        unexhausted = [];

        // Check whether each predecessor is exhausted
        for (successor of graph.successors(node)){
            if (successor in exhaustedNodes){
                // Skip exhausted successor
                continue;
            }else{
                // If not exhausted then add to list to return
                unexhausted.push(successor);
            }
        }; 
        
        return unexhausted;
    }

}

