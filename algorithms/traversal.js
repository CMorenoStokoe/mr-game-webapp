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
    const queue = [{source: 'start', target: root},];
    const visits = {};
    const loopHolder = {source: null, target: null};
    const loops = {};

    console.log(graph, root, queue)
    console.log('gnodes',graph.numberOfNodes())
    

    for (i = 0; i < Math.pow(graph.nodes().length, 2); i++){ // failsafe
        
        // Search network until queue empty
        if(queue[0] == undefined){console.log('DFS search finished.');break;} // failsafe
        //if(queue[0] == undefined){
            
            // RECORD EDGES NOT NODES, THEN KEEP COUNT OF EDGES AND ONCE TRAVELLED 10 TIMES REMOVE

            // Get current node
            const currentNode=queue[0].source;
            const target=queue[0].target;
            
            console.log(currentNode);

            // Shift item from queue
            queue.shift();

            // Increment node visit count
            if(visits[currentNode]>0){ visits[currentNode]++ }else{ visits[currentNode]=1 };

            // Mark node as visited
            if(visits[currentNode] > recursionLimit){ // If node visited (n >= recursionLimit) times

                console.log('looped 10', currentNode);

                // Skip looping node 
                continue;
            }

            // Add node to list of nodes in loops if visits over recursionLimit
            if(visits[currentNode] >= recursionLimit){ 
                loops[currentNode]=true; 
                loopHolder.source = loopHolder.target;
                loopHolder.target = currentNode;
            }

            // Add successors to front of queue
            for (successor of graph.successors(currentNode)){ queue.unshift(successor); };

    }
    
    console.log('Loop search finished.');
    console.log('visits', visits);
    console.log('Loops', loops);
    console.log('Loopholder', loopHolder);

    return visits;

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
        if(queue[0] == undefined){console.log('DFS search finished.');break;}
        /* Failsafes (above)
            1. Maximum number of iterations (n nodes ^2) to avoid infinite loops 
            2. Search while the queue is not empty  to avoid runtime error when queue is emptied
        */
        console.log('queue',queue)
        console.log('exhaustednodes',exhaustedNodes)
       
        // 1. Get node n from queue 
        const currentNode = queue[0];

        // 2. Check if all predecessor nodes of n have already been searched exhaustively
        const isExhausted = checkExhausted(currentNode);
        
        // 3. If node not exhausted, move node to back of queue 
        if(!(isExhausted)){
            queue.shift();
            queue.push(currentNode);
        }

        // 4. Break if a loop is found (i.e., a node searching its predecessors finds itself)

        // 5. Once a node is exhausted then add this to the path to record search order
        if(isExhausted){
            path.push(currentNode); 
            exhaustedNodes[currentNode]=true;
        }

        // 5. Add successors of node n to queue
        for (successor of graph.successors(currentNode)){ queue.unshift(successor); };

        // 6. Continue until all nodes have been exhausted (predecessor nodes exhaustively searched)
        continue;
    }
    // 7. Return order of nodes to explore in order to fully explore network as 
    return(path); // Array of arrays containing edges to follow in order ([[a,b],[b,c]])

    // Exhaustion control 
    function checkExhausted(node){ 
        
        // Return false if any edge is in exhaustion exhaustedNodes stack
        for (predecessor of graph.predecessors(node)){
            if (predecessor in exhaustedNodes){continue;}else{return false;}
        }; return true;

    }


}

