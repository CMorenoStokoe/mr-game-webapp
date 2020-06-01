// Great directed network graph G object
var G = new jsnx.DiGraph();

G.addNodesFrom([
    [0, {label : 'exercise', value: 0.25}],
    [1, {label : 'sleep', value: 0.25}],
    [2, {label : 'depression', value: 0.25}],
    [3, {label : 'wellbeing', value: 0.25}],
]);
G.addEdgesFrom([[0,1], [0,2], [1,3]]);
//G.addEdgesFrom([[0,1, {b: 1}], [2,0, {b: 1}], [2,4, {b: 1}], [3,1, {b: 1}], [5,4, {b: 1}]]);

/* 
Breadth-First Search Traversal 
---------
Description: 
1. Start at one node
2. Discover outgoing (succeeding) edges
3. Discover successor nodes of the original node
4. Discover the succeeding edges of the successor nodes to discover their successor nodes
5. Continue traversal breadth-first until all nodes at end of branch have no more undiscovered successors, or a loop occurs

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