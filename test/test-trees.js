
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
var G_basic = new jsnx.DiGraph();
G_basic.addNodesFrom([n.A,n.B,n.C,n.D,n.E]); // Add nodes with colors
G_basic.addEdgesFrom([['A','B'], ['B','C']]); // Primary branch
G_basic.addEdgesFrom([['B','D'], ['D','E']]); // Fork to alternative branch

tremauxTrees.push({
    id: 0, 
    title: 'Basic network', 
    label: 'Trémaux tree containing a forking path, tests whether the algorithm can handle a branching network.', 
    g: G_basic,
    answers: {
        selfloops: [],
        traversal: ['A', 'B', 'D', 'E', 'C'], //or ['A', 'B', 'C', 'D', 'E']
        propagation: {'A':1,'B':"0.5",'D':"0.25",'E':"0.125",'C':"0.25"},
    }
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
var G_crossover = new jsnx.DiGraph();
G_crossover.addNodesFrom([n.A,n.B,n.C,n.D,n.E, n.F]) // Add nodes
G_crossover.addEdgesFrom([['A','B'], ['B','C']]); // Primary branch
G_crossover.addEdgesFrom([['A','D'], ['D','E'], ['E', 'F']]); // Alternative branch
G_crossover.addEdgesFrom([['C','E']]); // Cross edge

tremauxTrees.push({
    id: 1, 
    title: 'Cross-over edge', 
    label: 'Trémaux tree containing one edge which crosses from one branch over to another, and one edge which skips ahead in the path. This tests whether the algorithm can handle non-linear networks in which branches intermingle and interact with nodes in the same branch as well as other branches.', 
    g: G_crossover,
    answers: {
        selfloops: [],
        traversal: ['A', 'D', 'B', 'C', 'E', 'F'], //or ['A', 'B', 'C', 'D', 'E', 'F'] 
        propagation:{'A':1, 'D':'0.5', 'B':'0.5', 'C':'0.25', 'E':'0.375', 'F':'0.1875'},
    },
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
var G_selfloop = new jsnx.DiGraph();
G_selfloop.addNodesFrom([n.A, n.B, n.C]) // Add nodes
G_selfloop.addEdgesFrom([['A','B'], ['B','C']]); // Primary branch
G_selfloop.addEdgesFrom([['B','B']]); // Self-loop

tremauxTrees.push({
    id: 2, 
    title: 'Self-looping edge', 
    label: 'This Trémaux tree tests whether the algorithm can handle a node which has an edge to itself (i.e., A<->A). These are illegal in MR and so should not end up in valid MR networks, but if they do then these are identified and removed.', 
    g: G_selfloop,
    answers: {
        selfloops: [['B', 'B']],
        traversal: ['A', 'B', 'C'],
        propagation: {'A':1,'B':"0.5",'C':"0.25"}
    },
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
var G_fwd = new jsnx.DiGraph();
G_fwd.addNodesFrom([n.A,n.B,n.C,n.D]) // Add nodes
G_fwd.addEdgesFrom([['A','B'], ['B','C'], ['C','D']]); // Primary branch
G_fwd.addEdgesFrom([['B','D']]); // Forward edge

tremauxTrees.push({
    id: 3, 
    title: 'Forward edge', 
    label: 'Trémaux tree containing one edge which skips ahead in the path. This tests whether the algorithm can handle non-linear networks in which nodes interact with other nodes further along in the same branch.', 
    g: G_fwd,
    answers: {
        selfloops: [],
        traversal: ['A', 'B', 'C', 'D'],
        propagation:{'A':1,'B':"0.5",'C':"0.25", 'D':'0.375'},
    },
});

/*

Full tree
----------
Description: Complex tree containing edges which cross over from one branch to another, as well as a forward edge, and a self loop.
This tests whether the algorithm is capable of traversing cross edges and forward edges, as well as self loops all in the same network.

Diagram:

        C - D
A - B <     |
    U   E - F - G
        \______/

        
*/

// JSNX graph object for full tree
var G_full = new jsnx.DiGraph();
G_full.addNodesFrom([n.A,n.B,n.C,n.D,n.E,n.F,n.G]) // Add nodes
G_full.addEdgesFrom([['A','B'], ['B','C'], ['C','D']]); // Primary branch
G_full.addEdgesFrom([['B','E'], ['E','F'], ['F','G']]); // Alternative branch
G_full.addEdgesFrom([['D','F']]); // Cross edge
G_full.addEdgesFrom([['E','G']]); // Forward edge
G_full.addEdgesFrom([['B','B']]); // Self edge

tremauxTrees.push({
    id: 4, 
    title: 'Complex network', 
    label: 'Trémaux tree containing cross, forward and self loop edges. Tests whether algorithm can handle complex interacting networks.', 
    g: G_full,
    answers: {
        selfloops: [['B','B']],
        traversal: ['A', 'B', 'E', 'C', 'D', 'F', 'G'], //or ['A', 'B', 'C', 'D', 'E', 'F', 'G'] 
        propagation:{'A':1,'B':"0.5",'E':"0.25",'C':"0.25",'D':"0.125",'F':"0.1875",'G':"0.21875"},
    },
});

/*


Bidirectional tree
----------
Description: This tree contains two nodes which both have edges to each other, forming a bi-directional link. This tests whether the algorithm can handle networks with bi-directional edges in them.

Diagram:

A - B <-> C


*/

// JSNX graph object for bi-directional tree
var G_bi = new jsnx.DiGraph();
G_bi.addNodesFrom([n.A, n.B, n.C]) // Add nodes
G_bi.addEdgesFrom([['A','B']]); // Path
G_bi.addEdgesFrom([['B','C'], ['C','B']]); // Bi-directional link

tremauxTrees.push({
    id: 5, 
    title: `<span class="badge badge-warning">Not yet supported</span><br>
    Bi-directional edge`, 
    label: 'This Trémaux tree tests whether the algorithm can handle bi-directional edges between two nodes. These relationships do not present strong evidence in MR and so should not end up in valid MR networks, but if these do the plan is to identify and remove them.', 
    g: G_bi,
    answers: {
        selfloops: [],
        traversal: ['Not yet supported'],
        propagation: {'Not yet supported' : true, 'A':1,'B':"0.5",'C':"0.25"}
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
var G_loop = new jsnx.DiGraph();
G_loop.addNodesFrom([n.A, n.B, n.C]) // Add nodes
G_loop.addCycle(['A','B','C']); // Cycle

tremauxTrees.push({
    id: 6, 
    title: `<span class="badge badge-warning">Not yet supported</span><br>
    Looping network`, 
    label: 'This Trémaux tree tests whether the algorithm can handle edges between nodes which loop back on themselves forming a cycle. While legal in MR, these form infinite propagation loops so the plan is to identify and remove looping edges.', 
    g: G_loop,
    answers: {
        selfloops: [],
        traversal: ['Not yet supported'],
        propagation: {'Not yet supported' : true, 'A':1,'B':"0.5",'C':"0.25"}
    },
    disabled:true,
});

/*


Full tree
----------
Description: This tree combines all of the above tests to test whether the algorithm can traverse a complex network.
This tree is accurate of complex real-world MR network conditions.

Diagram:

/ - - - - - - - - - G
|       C - D - E <     
A - B <   /         F 
^       H - I - J  | 
|       ^   U   |  |
|       |_______|  |
|                  |
|__________________|
nb: D->H, A->G
                    
*/

// JSNX graph object for full tree
var G_full = new jsnx.DiGraph();
G_full.addEdgesFrom([[0,1], [1,2], [2,3], [3,4], [4,6], [4,5]]); // Primary branch
G_full.addEdgesFrom([[1,7], [7,8], [8,9]]); // Alternative branch
G_full.addEdgesFrom([[3,7]]); // Cross edge
G_full.addEdgesFrom([[0,6]]); // Forward edge
G_full.addEdgesFrom([[9,7], [5,0]]); // Back edges forming loops
G_full.addEdgesFrom([[8,8]]); // Self-loop

//tremauxTrees.push(G_full); 
