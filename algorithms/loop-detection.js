/*

Description
-----------
The purpose of this script is to detect loops in a manner generalisable to many complex and different networks

*/


// Find and remove loops from graph
function removeLoops (graph, root){
    const queue = [root];
    const path = [];
    const G = graph;
    const loops = [];

    // Use colors to keep track of visited nodes (white = not visited, grey = visiting, black = visited)
    const color = []; 
    
    // Run traversal
    search(queue[0]); 

    // Get successors of node
    function search(node){ 

        // Color node as visiting
        color[node] = 'grey';
        
        for (successor of G.successors(node)){

            if(color[successor]=='grey'){ 
                
                // If a loop is found, remove it from the Graph and continue
                G.removeEdge(node, successor);
                loops.push([node, successor])
                
            } else {

                search(successor);
            }

        };

        // Once done, color node as visited
        color[node] = 'black';
    }

    return(loops);
}