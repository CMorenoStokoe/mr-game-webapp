
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
    title: 'Basic forked Trémaux tree', 
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
Description: Complex tree containing edges which cross over from one branch to another, as well as a forward edge.
This tests whether the algorithm is capable of traversing cross edges and forward edges.

Diagram:

        C - D
A - B <     |
        E - F - G
        \______/

        
*/

// JSNX graph object for cross-over tree
var G_crossover = new jsnx.DiGraph();
G_crossover.addNodesFrom([n.A,n.B,n.C,n.D,n.E,n.F,n.G]) // Add nodes
G_crossover.addEdgesFrom([['A','B'], ['B','C'], ['C','D']]); // Primary branch
G_crossover.addEdgesFrom([['B','E'], ['E','F'], ['F','G']]); // Alternative branch
G_crossover.addEdgesFrom([['D','F']]); // Cross edge
G_crossover.addEdgesFrom([['E','G']]); // Forward edge

tremauxTrees.push({
    id: 1, 
    title: 'Forward and crossing Trémaux tree', 
    label: 'Trémaux tree containing one edge which crosses from one branch over to another, and one edge which skips ahead in the path. This tests whether the algorithm can handle non-linear networks in which branches intermingle and interact with nodes in the same branch as well as other branches.', 
    g: G_crossover,
    answers: {
        selfloops: [],
        traversal: ['A', 'B', 'E', 'C', 'D', 'F', 'G'], //or ['A', 'B', 'C', 'D', 'E', 'F', 'G'] 
        propagation:{'A':1,'B':"0.5",'E':"0.25",'C':"0.25",'D':"0.125",'F':"0.1875",'G':"0.21875"},
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
G_selfloop.addEdgesFrom([['A','A']]); // Self-loop

tremauxTrees.push({
    id: 2, 
    title: 'Self-loop Trémaux tree', 
    label: 'This Trémaux tree tests whether the algorithm can handle a node which has an edge to itself. These are illegal in MR and so should not end up in valid MR networks, but if they do then these are identified and removed.', 
    g: G_selfloop,
    answers: {
        selfloops: [['A', 'A']],
        traversal: ['A', 'B', 'C'],
        propagation: {'A':1,'B':"0.5",'C':"0.25"}
    },
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
G_loop.addCycle([0,1,2]); // Cycle

//tremauxTrees.push(G_loop);

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
