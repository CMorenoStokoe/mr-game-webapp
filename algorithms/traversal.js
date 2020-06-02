/* 
Breadth-First Search Traversal 
============================
Description: 
1. Start at a node (origin node)
2. Discover outgoing (succeeding) edges from this node
3. Discover successor nodes connected at the end of these edges
5. Continue discovering nodes until no more remain or they loop back to the origin

BFS
----
The implamentation of bredth-first search is differentiated from depth-first search by implamenting a queue system and adding new 
new nodes to the back of this queue. This results in nodes being explored in the order they are discovered.
*/

// Create directed graph
var G = new jsnx.DiGraph();

// Populate graph with nodes and edges
G.addNodesFrom([
    [0, {label : 'exercise', value: 0.25}],
    [1, {label : 'sleep', value: 0.25}],
    [2, {label : 'depression', value: 0.25}],
    [3, {label : 'wellbeing', value: 0.25}],
    [4, {label : 'chd', value: 0.25}],
    [5, {label : 'bp', value: 0.25}],
    [6, {label : 'bmi', value: 0.25}],
    [7, {label : 'schizophrenia', value: 0.25}],
    [8, {label : 'shift work', value: 0.25}],
    [9, {label : 'chronotype', value: 0.25}],
]);
G.addCycle([0,1,2,3,4])
//G.addCycle([0,2,4])
//G.addEdgesFrom([[3,1], [3,2], [3,4]]);
//G.addCycle([0,7,8,9,0])

console.log(G);

origin = 0; // Define origin node

queue = [origin]; // Add origin node to search queue

// Search while the queue is not empty
while (queue[0] != undefined){ 

    // Get successor nodes for first node in queue
    successors = G.successors(queue[0]);

    for (const successor of successors) {

        // Skip node if it is the origin
        if (successor==origin){continue}

        // Add successors to the queue 
        queue.push(successor);
        console.log('successor found:', successor);
    };

    // Remove the searched node from the list
    queue.shift();
}

//G.addEdgesFrom([[0,1, {b: 1}], [2,0, {b: 1}], [2,4, {b: 1}], [3,1, {b: 1}], [5,4, {b: 1}]]);


/*
console.log('G',G);
console.log('nodes',G.nodes());
console.log('node0Exists',G.hasNode(0));
console.log('node0Map',G.get(0));

// Make iterator of successor nodes for each node in network
iter = G.adjacencyIter();
let result = iter.next();
while (!result.done) {
 console.log('adjacencyIter n', result.value); 
 console.log('adjacencyIter n value.adjacencies', result.value[1]['_numberValues']); 
 result = iter.next();
}

// Set node attribute
const setAttr = jsnx.setNodeAttributes(G, 'value', {0:1});

// Iterate over nodes 
const iterNodes = jsnx.nodesIter(G)
console.log('nodes iter', iterNodes)

// Get node attribute
const getAttr = jsnx.getNodeAttributes(G);
for (const i in getAttr){console.log(i)};
*/


/*
jsnetworkx methods 
--------------

Nodes 
====
Iterator of all outgoing node adjacencies - adjacencyIter()
Successor nodes of node - successors(n)
Iterator of successor nodes - successorsIter(n)
All adjacent nodes map - get(n)
Self looping nodes - nodesWithSelfloops()

Edges
====
Edges succeeding from a node - edgesIter(optNbunch, optData=false)
Edges part of loops - selfloopEdges(optData=false)
Degree of a node, number of edges attached - degree(optNbunch, optWeight) - 

General : Other methods
======
copy graph - copy()
create subgraph of nodes given, attribute changes saved to original graph - subgraph(nbunch)
iterate over nodes - nodesIter(optData=false)

Debug
====
Number of nodes in graph - numberOfNodes()
Number of edges in graph - numberOfEdges(u, v)

*/