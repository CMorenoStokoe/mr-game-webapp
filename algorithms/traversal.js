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
    console.log('Starting DFS search, max iterations = ', Math.pow(graph.nodes().length, 2))

    // Initialise queue, recursion and path lists
    const queue = [{source: 'start', target: root},]; // Add root node to search queue
    const recursion = {}; // Memory of nodes already identified
    const path = []; // Paths taken through nodes from origin

    // Run depth-first search 
    for (i = 0; i < Math.pow(graph.nodes().length, 2); i++){ // Failsafe : Maximum number of iterations (n nodes ^2) to avoid infinite recursion loops caused by error
        
        // Failsafe : Search while the queue is not empty 
        if(queue[0] == undefined){console.log('DFS search finished.');break;}
        
        // Check if edges already travelled
        if(isRecusive(queue[0])){continue;}

        // Search edge
        search(queue[0]);
    }
     
    // Return DFS path as array of arrays ([[a,b],[b,c]])
    return(path);


    // Recursion control 
    function isRecusive(edge){ // Check if edge is in recursion stack
        
        // Form edge unique identifier from source and target nodes
        const edgeID = [edge.source, edge.target];
     
        if(edgeID in recursion){ // Edge already travelled and recorded in recursion dictionary
            
            // Prevent re-travelling already travelled edges
            console.log('Skipping repeat: ', edge.source, '-->', edge.target)
            queue.shift(); // Prevents recursion loops
            return true; // Return true to indicate duplicate edge

        } else { // Not already travelled

            recursion[edgeID]=true;  // Add node to the recursion list of searched nodes for future
            return false; // Return false to indicate new edge
        }
    }

    // Depth-first search
    function search(edge){ // Run search through queue and record path

        // Path - Add current node and successor to path (unless this is the first edge)
        if(edge.source != 'start'){ path.push([edge.source,edge.target]); } 

        // Queue - Remove current edge from the queue of nodes to search
        queue.shift();

        // Identify successors - Get successor nodes for source node
        successors = graph.successors(edge.target);

        for (const successor of successors) { // Add each successor node to the depth-first search queue

            // Add successors to the front of the queue to explore them immediately
            queue.unshift({source: edge.target, target: successor}); 
            
        };

        // Log of path
        console.log('Searching edge: ', edge.source, '-->', edge.target, ' (', successors.length, ' successors)');

    }
}