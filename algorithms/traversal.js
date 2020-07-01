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

// Run 'Two steps forward one step back" depth-first search variant
function DFS(graph, root){
    //console.log('Starting DFS search, max iterations = ', Math.pow(graph.numberOfNodes(), 2))

    // Initialise queue, exhaustedNodes and path lists
    const queue = [root]; // Add root node to search queue
    const exhaustedNodes = {root : true}; // Memory of nodes already travelled exhaustively
    const path = []; // Paths taken through nodes from origin

    // Run DFS variant
    for (i = 0; i < Math.pow(graph.nodes().length, 2); i++){ 
        /* 
        Failsafes
            1. Maximum number of iterations (n nodes ^2) to avoid infinite loops (above)
            2. Search while the queue is not empty  to avoid runtime error when queue is emptied (below)
        */
        if(queue[0] == undefined){break;}//console.log('DFS search finished.');

        // 1. Get node n from queue 
        const currentNode = queue[0];

        //console.log('searching ', currentNode, ' (exhausted ', exhaustedNodes, ' queue: ', queue, ')')

        // Skip node if already exhausted
        if(exhaustedNodes[currentNode]==true){

            // Remove node from queue and continue
            console.log('skipping already exhausted node');
            queue.shift();
            continue;
        }

        // 2. Check if node is exhaustible (if all precursors are exhausted)
        exhaustible = exhaustedPredecessors(currentNode);
        
        // 3. If precursors are exhausted
        if(exhaustible){
            //console.log('exhaustible')

            // Set node exhausted
            exhaustedNodes[currentNode] = true;

            // Remove node from queue 
            queue.shift();
            
            // Add exhausted node to path
            for (const predecessor of graph.predecessors(currentNode)){
                path.push({source: predecessor, target: currentNode});
            } 

            // Add successors of node n to queue
            for (successor of unExhaustedSuccessors(currentNode)){ queue.unshift(successor); };
        }

        // 3. If node not exhaustible skip for now and come back to later when predecessors are exhausted
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

    // 7. Return array of edges to traverse in an order which exhausts each node in series (i.e., propagation order)
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

