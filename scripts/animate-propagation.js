/*

Animate propagation
===================
Description:
This script calculate the path to animate the propagation effects and updates view as well as model.

Use:
The main script calls this and this uses view methods and propagation data.

*/

// Animate propagation
function animatePropagation(paths, dataCallback, interval=2500){
    // Select animation
    animation1(paths, dataCallback, interval=2500);
    //animation2(paths, dataCallback, interval=2500);
}

/* Animation style 2 */
function animation2(paths, dataCallback, interval=2500){

    // Initialise queue of nodes to highlight with intervention source
    var queue = [{node: gameData.nodes[paths[0].source], precursorNode: null, precursorEdge: null}];

    // Highlight intervention effects
    highlightNodes(queue);

    // Highlight node and add next node to queue
    function highlightNodes(queue){

        // Get node
        const nextInQueue = queue.shift()
            const node = nextInQueue.node;
            const precursorNode = nextInQueue.precursorNode;
            const precursorEdge = nextInQueue.precursorEdge;

        // Fade nodes not in focus   

            // Define transparency 
            const transparency = 0.3;

            // Apply transparency
            setNodeOpacity(transparency);
            setEdgeOpacity(transparency);
            
        // Animate intervention effects

            // Nodes

                // Current node
                animateNode(node);

                // Precursor node
                if(precursorNode){animateNode(precursorNode)}
            
            // Edges
            
                // Precursor edge
                if(precursorEdge){animateEdge(precursorEdge)}
                
                // All outgoing edges
                for(const edge of node.edges){ 
                    if(node.id == edge['id.exposure']){
                        
                        
                        setTimeout(function(){
                            // Animate edge
                            animateEdge(edge);
                            // Animate target node
                            animateNode(gameData.nodes[edge['id.outcome']]);
                        }, 250)


                        // Push node to queue
                        queue.unshift({
                            node: gameData.nodes[edge['id.outcome']],
                            precursorNode: node,
                            precursorEdge: edge,
                        })
                    }
                };

        // Node animation
        function animateNode(node){

            // Circle
            formatNode(node); // Set node size
            focusOnNode(node.id, transparency, interval);

            // Label
            updateLabel(node, interval/2); // Update node labels
            showLabel(node.id); // Show labels
                setTimeout(function(){ // Hide labels again after
                    hideLabel(node.id); 
                }, interval-50)
        }

        // Edge animation
        function animateEdge(edge){

            // Highlight edge
            highlightEdge(`#edge_${edge.id}`, interval);
            highlightEdge(`#edge_${edge.id}_outline`, interval);
        }

        // Iterate until all animations shown
        if(queue.length>0 && !(skipAnimations)){setTimeout(function(){ if(!(skipAnimations)){
            highlightNodes(queue); 
        }}, interval);} 
    }
}

/* Animation style 1 */
function animation1(paths, dataCallback, interval=2500){
    
// Fade out nodes not in focus

    // Define transparency 
    const transparency = 0.3;

    // Apply transparency
    setNodeOpacity(transparency);
    setEdgeOpacity(transparency);
    
// Prepare path for visualisation

    // Filter paths to show unique edges only
    var dictionaryFilter = {};
        for(const edge of paths){dictionaryFilter[`${edge.source}${edge.target}`]=edge}
    var uniqueEdges = [];
        for(const [key, uniqueEdge] of Object.entries(dictionaryFilter)){uniqueEdges.push(uniqueEdge)}
    paths = uniqueEdges;

    // Show intervention effects
    console.log(paths)

    // Intervention effect on origin node
    const originNode = gameData.nodes[Object.entries(dictionaryFilter)[0][1].source];
        formatNode(originNode); // Set node size
        updateLabel(originNode, interval/2); // Update node labels

    // Intervention effects propagated through network  
    if(!(skipAnimations)){
        setTimeout(function(){
            if(!(skipAnimations)){
                iteratePaths(paths);
            }
        }, interval/2)
    }

    // Iterate paths and show effects
    var previousNode = null;
    function iteratePaths(edges){

        // Fade out nodes not in focus
        setNodeOpacity(transparency);
        setEdgeOpacity(transparency);

        // Get edge from path array
        const path = edges.shift();

    /* Show intervention effect pathways */

        // Animate labels to pop up
        showLabel(path.source);
        setTimeout(function(){ // Hide labels again after
            if(!(skipAnimations)){
                hideLabel(path.source);
            }
        },interval-50)

    /* Show intervention's effects on each nodes' prevalence */
            
        // Update source node
        const sourceNode = gameData.nodes[path.source];
        focusOnNode(sourceNode.id, transparency, interval);
        formatNode(sourceNode); // Set node size
        
        if(!(sourceNode.id==previousNode)){
            if(!(skipAnimations)){
                updateLabel(sourceNode, interval/2); // Update node labels
            }
        }previousNode = sourceNode.id

    // Update target node (after short delay to show cause and effect)
        
        // Compensate time interval
        const fullTimeInterval = interval;
            const delay = 750;
            const delayedInterval = fullTimeInterval-delay;

        // Update target node
        setTimeout(function(){

            // Highlight edge
            const edge = gameData.edges[gameData.getEdgeId(path.source, path.target)];
                highlightEdge(`#edge_${edge.id}`, delayedInterval);
                if(settings.links.outline){ highlightEdge(`#edge_${edge.id}_outline`, delayedInterval);}
            
            // Show label
            showLabel(path.target); 
            setTimeout(function(){ // Hide labels again after
                hideLabel(path.target); 
            },delayedInterval-100)

            // Highlight node
            const targetNode = gameData.nodes[path.target];
                focusOnNode(targetNode.id, transparency, delayedInterval);
                formatNode(targetNode); // Set node size
                updateLabel(targetNode, delayedInterval/2); // Update node label

            // Perform data callback
            dataCallback(targetNode);

        }, delay);

    // Show intervention effects until all effects shown

        // While there are effects left to show AND the option to skip animations is not selected
        if(edges.length>0 && !(skipAnimations)){
            
            // Separate out each animation with delay   
            setTimeout(function(){     
                
                if(!(skipAnimations)){
                    iteratePaths(edges); // Self-loop
                }

            }, interval);
        } 

        // Once all effects have been shown
        else { 

            // Delay until after the last animation will have concluded
            setTimeout(function(){

                // Restore visualisation opacity
                setNodeOpacity(1); // Return nodes to normal transparency
                setEdgeOpacity(1); // Return edges to normal transparency

            }, interval + 500);
        }
    }
}    