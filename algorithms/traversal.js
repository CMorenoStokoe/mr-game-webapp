/* 
Depth-First Search Traversal Variant
`One step forward two steps back`
============================
Description: 
nb.exhausted=resolved
1. Get node n from queue 
2. Check if all predecessor nodes of n have already been searched exhaustively
    3. Resolve node if all predecessor nodes are resolved, add successors of node n to queue
    4. If not: add to end of queue, add unresolved predecessors to front if queue
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

// Run DFS
function DFS(graph, root){

    // Init search queue
    const queue = [root];

    // Path of traversal for propagation
    const path = {};
        path.edges = []; // Path of edges arranged in order of suggested traversal
        path.nodes = []; // Path of nodes arranged in order of suggested traversal 

    // Run search with failsafes to avoid infinite loops
    for (i = 0; i < Math.pow(graph.nodes().length, 2); i++){ 
        if(queue[0] == undefined){break;}

        // Add node to search path
        if(!(path.nodes.includes(queue[0]))){path.nodes.push(queue[0])};

        // Find successors of node
        for(const successor of graph.successors(queue[0])){
            
            // Get edge beta
            const b = getEdgeBeta([queue[0], successor]);

            // Add edge to search path
            path.edges.push({source: queue[0], target: successor, b: b});

            // Add to queue
            queue.push(successor);
        }
        
        // Remove current item from queue
        queue.shift();

    }

    return(path);

    // Function to return edge beta weights
    function getEdgeBeta(edge){

        for([key, value] of jsnx.getEdgeAttributes(graph, 'b').entries()){
            if(key[0] == edge[0] && key[1] == edge[1]){return(value)};
        }

    }

}