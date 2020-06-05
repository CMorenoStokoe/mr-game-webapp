/* 
Depth-First Search Traversal 
============================
Description: 
1. Start at a node (root node)
2. Discover outgoing (succeeding) edges from this node
3. Discover successor nodes connected at the end of these edges
5. Continue discovering nodes until no more remain or they loop back to the root

DFS
----
The implementation of depth-first search (DFS) is differentiated from bredth-first search (BFS) by implementing a queue system and adding new 
new nodes to the front of this queue. This results in nodes being explored 'depth-first' by following a node's path until it ends.
Bredth-first however searches nodes in the order they are discovered.

Example:
a - b 
a - c
b - d

DFS will search this network in this order: a-b, b-d, a-c
BFS will search this network in this order: a-b, a-c, b-d

Critically, this algorithm is  suited to avoiding loops because it follows a path until exhaustion, so can use this to remember the 
route and avoid visiting nodes it has visited before.

*/


// Run depth-first search to identify loops
function DFS(graph, root){

    const queue = [root]; // Add root node to search queue
    const recursion = {}; // Memory of nodes already identified
    const path = []; // Paths taken through nodes from origin

    // Failsafe maximum number of iterations (n nodes ^2) to avoid infinite recursion loops caused by error
    for (i = 0; i < Math.pow(G.nodes().length, 2); i++){

        // Search while the queue is not empty 
        if(queue[0] == undefined){console.log('DFS queue empty, search finished.');break;}

        // Process only nodes which have not already been searched (avoids recursive loops)
        if(queue[0] in recursion){
            queue.shift();
            continue;
        }

        // Assign first item in queue to currentNode so queue can be edited independently
        currentNode = queue[0];

        // Remove from the queue of nodes to search
        queue.shift();

        // Get successor nodes for first node in queue
        successors = graph.successors(currentNode);

        // Add node to the recursion list searched nodes
        recursion[currentNode]=true;

        // Add each successor node to the depth-first search queue
        for (const successor of successors) {
            
            // Add current node and successor to path
            path.push([currentNode, successor]);

            // Add successors to the front of the queue to explore them immediately
            queue.unshift(successor);
            
        };
        
    }
    // Return DFS path as array of arrays ([[a,b],[b,c]])
    return(path);
}