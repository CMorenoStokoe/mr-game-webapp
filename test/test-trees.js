
/* 

Directed Trémaux trees
=====================
Description:
This file contains variations on network trees for testing the propagation model.

Trémaux trees:
These trees are constructed to test that the traversal algorithms can accurately traverse and produce paths for
propagation travel from different types of networks. These trees feature different edge types and configurations
which add complexity to traversing different networks and may cause failure in the traversal algorithms.
These Network tests are designed to validate that the representation, traversal and propagation methods work as 
intended and generalise to many different types of real-world networks.

Use:
This list will be iterated over in testing the traversal and propagation algorithms.

*/

tremauxTrees = [];


/*


Basic tree
----------
Description: Basic linear tree with two branches tests whether algorithm is capable of basic travel and can traverse 
branching paths (forks).

Diagram:

        C
A - B <
        D - E

*/

// JSNX graph object for basic tree
edges=[
    ['A','B'], ['B','C'], // Primary branch
    ['B','D'], ['D','E'], // Fork to alternative branch
];

tremauxTrees.push({
    id: 0, 
    title: 'Basic network', 
    label: 'Trémaux tree containing a forking path, tests whether the algorithm can handle a branching network.', 
    data: getTestDataInfo(edges),
    answers: {
        selfloops: [],
        traversal: ['A', 'B', 'C', 'D', 'E'], //or ['A', 'B', 'D', 'E', 'C']
        propagation: {'A':"1",'B':"0.5",'C':"0.25", 'D':"0.25", 'E':"0.125",}, //or {'A':"1",'B':"0.5",'D':"0.25",'E':"0.125",'C':"0.25"}
    },
    disabled:false,
});

/*

Cross-over tree
----------
Description: Trémaux tree containing an edges which cross over from one branch to another.
This tests whether the algorithm is capable of traversing cross edges.

Diagram:

    B - C
A <     |
    D - E - F
        

        
*/

// JSNX graph object for cross-over tree
edges=[
    ['A','B'], ['B','C'], // Primary branch
    ['A','D'], ['D','E'], ['E', 'F'], // Alternative branch
    ['C','E'], // Cross edge
]; 

tremauxTrees.push({
    id: "1", 
    title: 'Cross-over edge', 
    label: 'Trémaux tree containing one edge which crosses from one branch over to another, and one edge which skips ahead in the path. This tests whether the algorithm can handle non-linear networks in which branches intermingle and interact with nodes in the same branch as well as other branches.', 
    data: getTestDataInfo(edges),
    answers: {
        selfloops: [],
        traversal: ["A","B","D","C","E","F"] , //or ['A', 'D', 'B', 'C', 'E', 'F']
        propagation:{"A":"1","B":"0.5","C":"0.25","D":"0.5","E":"0.375","F":"0.1875"}, //or {'A':"1", 'D':'0.5', 'B':'0.5', 'C':'0.25', 'E':'0.375', 'F':'0.1875'}
    },
    disabled:false,
});

/*

Self-loop tree
----------
Description: This tree contains a self loop to test whether the algorithm can traverse networks where one node
has an edge to itself. These edges are illegal in MR and so are deleted.

Diagram:

A - B - C
    U

*/

// JSNX graph object for self-loop tree
edges=[
    ['A','B'], ['B','C'], // Primary branch
    ['B','B'], // Self-loop
]; 

tremauxTrees.push({
    id: 2, 
    title: 'Self-looping edge', 
    label: 'This Trémaux tree tests whether the algorithm can handle a node which has an edge to itself (i.e., A<->A). These are illegal in MR and so should not end up in valid MR networks, but if they do then these are identified and removed.', 
    data: getTestDataInfo(edges),
    answers: {
        selfloops: [['B', 'B']],
        traversal: ['A', 'B', 'C'],
        propagation: {'A':"1",'B':"0.5",'C':"0.25"}
    },
    disabled:false,
});

/*

Forward tree
----------
Description: Forward tree containing an edge which travels forward in the network.
This tests whether the algorithm is capable of traversing forward edges.

Diagram:

A - B - C - D
    \______/
        
*/

// JSNX graph object for forward tree
edges=[
    ['A','B'], ['B','C'], ['C','D'], // Primary branch
    ['B','D'], // Forward edge
]

tremauxTrees.push({
    id: 3, 
    title: 'Forward edge', 
    label: 'Trémaux tree containing one edge which skips ahead in the path. This tests whether the algorithm can handle non-linear networks in which nodes interact with other nodes further along in the same branch.', 
    data: getTestDataInfo(edges),
    answers: {
        selfloops: [],
        traversal: ['A', 'B', 'C', 'D'],
        propagation:{'A':"1",'B':"0.5",'C':"0.25", 'D':'0.375'},
    },
    disabled:false,
});

/*

Complex tree
----------
Description: Complex tree containing edges which cross over from one branch to another, as well as a forward edge, and a self loop.
This tests whether the algorithm is capable of traversing cross edges and forward edges, as well as self loops all in the same network.

Diagram:

        C - D
A - B <     |
    U   E - F - G
        \______/

        
*/

// JSNX graph object for Complex tree
edges=[
    ['A','B'], ['B','C'], ['C','D'], // Primary branch
    ['B','E'], ['E','F'], ['F','G'], // Alternative branch
    ['D','F'], // Cross edge
    ['E','G'], // Forward edge
    ['B','B'], // Self edge
]

tremauxTrees.push({
    id: 4, 
    title: 'Complex network', 
    label: 'Trémaux tree containing cross, forward and self loop edges. Tests whether algorithm can handle complex interacting networks.', 
    data: getTestDataInfo(edges),
    answers: {
        selfloops: [['B','B']],
        traversal: ["A","B","C","E","D","F","G"], //or ['A', 'B', 'C', 'D', 'E', 'F', 'G'] or ['A', 'B', 'E', 'C', 'D', 'F', 'G']
        propagation:{"A":"1","B":"0.5","C":"0.25","D":"0.125","E":"0.25","F":"0.1875","G":"0.21875"}, //or {'A':"1",'B':"0.5",'E':"0.25",'C':"0.25",'D':"0.125",'F':"0.1875",'G':"0.21875"}
    },
    disabled:false,
});

/*


Bidirectional tree
----------
Description: This tree contains two nodes which both have edges to each other, forming a bi-directional link. This tests whether the algorithm can handle networks with bi-directional edges in them.

Diagram:

A - B <-> C


*/

// JSNX graph object for bi-directional tree
edges=[
    ['A','B'], // Path
    ['B','C'], ['C','B'], // Bi-directional link
]; 

tremauxTrees.push({
    id: 5, 
    title: `Bi-directional edge`, 
    label: 'This Trémaux tree tests whether the algorithm can handle bi-directional edges between two nodes. These relationships do not present strong evidence in MR and so should not end up in valid MR networks, but if these do the plan is to identify and remove them.', 
    data: getTestDataInfo(edges),
    answers: {
        selfloops: [],
        traversal: ['A', 'B', 'C'],
        propagation: {"A":"1","B":"0.5","C":"0.25"}, //or {'A':"1",'B':"0.5",'C':"0.25"}
    },
    disabled: true,
});


/*


Looping tree
----------
Description: This tree contains a back edge which forms a loop, to test whether the algorithm is capable of traversing loops.

Diagram:

A - B - C
^       |
|_______|

*/

// JSNX graph object for looping tree
edges=[
    ['A','B'], ['B','C'], ['C','A'], // Cycle
];

tremauxTrees.push({
    id: 6, 
    title: `Looping network`, 
    label: 'This Trémaux tree tests whether the algorithm can handle edges between nodes which loop back on themselves forming a cycle. While legal in MR, these form infinite propagation loops so the plan is to identify and remove looping edges.', 
    data: getTestDataInfo(edges),
    answers: {
        selfloops: [],
        traversal: ['A','B','C'],
        propagation: {'A':"1",'B':"0.5",'C':"0.25"}
    },
    disabled:true,
});

/*


Strongly related looping tree
----------
Description: This tree contains many looping edges.

Diagram:

*/

// JSNX graph object for looping tree
edges=[ // Cycles
    ['A','B'], ['B','C'], ['C','A'], 
    ['B','B'], ['B','F'], ['F','B'], 
    ['C','A'], ['A','F'], ['F','C'], 
    ['D','E'], ['E','C'], ['C','D'], 
    ['E','F'], ['F','G'], ['G','E'], 
    ['F','A'], ['A','C'], ['C','F'], 
    ['G','C'], ['C','F'], ['F','G'], 
];

tremauxTrees.push({
    id: 7, 
    title: `Strongly related looping network`, 
    label: 'This tree contains many looping edges similar to the real life situation.', 
    data: getTestDataInfo(edges),
    answers: {
        selfloops: [],
        traversal: ["A","B","F","C","G","D","E"], //or ["A","B","C","D","E","F","G"]
        propagation: {"A":"1","B":"0.5","C":"0.75","F":"1.21875","D":"0.375","E":"0.1875","G":"0.609375"}, //or {"A":"1","B":"0.5","C":"0.75","D":"0.375","E":"0.1875","F":""1".21875","G":"0.609375"}
    },
    disabled:false,
});