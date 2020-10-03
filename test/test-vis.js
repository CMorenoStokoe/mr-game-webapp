/* 

Visualisation
==============
Description:
File contains functions to visualise the trees and tests so they are more clear and the model more easily interpretable.

Use:
Designed to present the results of tests along with the node/edge and tree data.

*/


/* Graph display */


function setGDisplay(tremauxTrees){

    // Build network tree for current tremaux tree design
    tremauxTrees[0].G = new jsnx.DiGraph();
        for(const node of tremauxTrees[0].data.nodes){
            tremauxTrees[0].G.addNode(node.id, node);
        }
        for(const edge of tremauxTrees[0].data.edges){
            tremauxTrees[0].G.addEdge(edge.source, edge.target, edge);
        } 
    console.log(tremauxTrees[0].G);
    
    // Draw tree on SVG
    jsnx.draw(tremauxTrees[0].G, { 
        element: '#GDisplay-svg', 
        withLabels: true, 
        labelStyle: {fill: 'black'},
        stickyDrag: true,
        nodeStyle: {
            fill: function(d) { 
                return d.data.color; 
            }
        }, 
    });

    tremauxTrees[0].G.removeEdgesFrom(removeLoops(tremauxTrees[0].G, 'A'));
    console.log(tremauxTrees[0].G);

    // Grayscale graph if disabled
    if(tremauxTrees[0].disabled){ document.getElementById('GDisplay-svg').style.webkitFilter = "grayscale(100%) blur(1px)";} else {document.getElementById('GDisplay-svg').style.webkitFilter = ''}

    // Set title and display
    setHTML('GDisplay-title', tremauxTrees[0].title); // Title
    setHTML('GDisplay-subtitle', tremauxTrees[0].label); // Subtitle

    // Run testing
    testAlgorithm(tremauxTrees[0]); // Test algorithm on current tree
}

function cycleGDisplayFwd(tremauxTrees){
    
    // Cycle forwards in the list of graphs to display
    tremauxTrees.push(tremauxTrees[0]);
    tremauxTrees.shift();

    setGDisplay(tremauxTrees); // Set display

}

function cycleGDisplayBack(tremauxTrees){
    
    // Cycle backwards in the list of graphs to display
    tremauxTrees.unshift(tremauxTrees[tremauxTrees.length - 1]);
    tremauxTrees.pop();

    setGDisplay(tremauxTrees); // Set display

}

setGDisplay(tremauxTrees);


/* Run tests and display results */

function testAlgorithm(currentTree){

    /* Run tests */

    // Get tree details
    const id = currentTree.id; // Get tree id
    const title = currentTree.title; // Get tree title
    const label = currentTree.label; // Get tree label
    const tree = currentTree.G; // Get tree G object
    const answers = currentTree.answers // Get correct solutions to tree

    // Run tests
    const result_selfloop = test_selfloop(tree); // Identify and remove self-loops
    const result_traversal = test_traversal(tree); // Search network and get path of order in which to search nodes
    const result_propagation = test_propagation(result_traversal.path, tree); // Use traversal path for propagation
    console.log('Results. Selfloop: ', result_selfloop,' Traversal: ',result_traversal ,' Propagation: ', result_propagation)
    
    // Test results against expected values
    tests = validate([
        {name: 'Self-loop test', expected: JSON.stringify(answers.selfloops), actual: JSON.stringify(result_selfloop.selfloops)},
        {name: 'Traversal test', expected: JSON.stringify(answers.traversal), actual: JSON.stringify(result_traversal.path.nodes)},
        {name: 'Propagation test', expected: JSON.stringify(answers.propagation), actual: JSON.stringify(result_propagation.info)},
    ])
    
    // Reset result text on DOM
    document.getElementById("test_log").innerHTML = ''; 
    document.getElementById("badge-results").innerHTML='';

    // Write results on DOM
    if (tests['failed'].length > 0) { 
        // Set testing status to failing
        document.getElementById("badge-results").innerText = "Failing";
        document.getElementById("badge-results").className = "badge badge-warning";
        // Write fails to log
        messages="<strong>Log:</strong> <br>"
        for (const failure of tests['failed']){
            messages += failure + '<br>'
        }
        document.getElementById("test_log").innerHTML = messages;
    } else {
        // Set testing status to passing
        document.getElementById("badge-results").innerText = "Passing";
        document.getElementById("badge-results").className = "badge badge-success";
    }

    /* Display test results */

    // Self loop results

    //  text
    setHTML('GDisplay-test1-status', tests.values['Self-loop test'].status) // Write status to DOM
    if(tests.values['Self-loop test'].status=='Pass'){setColor('GDisplay-test1-status', 'green')} else {setColor('GDisplay-test1-status', 'red')} // Color according to status
    if(tests.values['Self-loop test'].result==undefined){ // Report no self loops found if none found
        setHTML('GDisplay-test1-result', 'No self-edges found')
    } else { // If self loops found report their edges
        setHTML('GDisplay-test1-result', tests.values['Self-loop test'].actual)
    }

    // graph
    var G_sl = new jsnx.DiGraph();

    try { // Add any self looping nodes to graph
        const selfloops = result_selfloop.selfloops;
        for (const edge of result_selfloop.selfloops){
            const node = edge[0];
            G_sl.addNode(node, testDat.nodes[node]);
            G_sl.addEdge(node, node);
        }
    } catch(err) {;}

    jsnx.draw(G_sl, { // Draw tree on SVG
        element: '#GDisplay-test1', 
        stickyDrag: true,
        nodeStyle: {
            fill: function(d) { 
                return d.data.color; 
            }
        }, 
    });

    // Traversal results

    //  text
    setHTML('GDisplay-test2-status', tests.values['Traversal test'].status) // Write status to DOM
    if(tests.values['Traversal test'].status=='Pass'){setColor('GDisplay-test2-status', 'green')} else {setColor('GDisplay-test2-status', 'red')} // Color according to status
    setHTML('GDisplay-test2-result', tests.values['Traversal test'].actual) // Path result from test

    //  graph
    jsnx.draw(result_traversal.tree, { // Draw tree on SVG
        element: '#GDisplay-test2', 
        withLabels: true, 
        labelStyle: {fill: 'black'},
        stickyDrag: true,
        nodeStyle: {
            fill: function(d) { 
                return d.data.color; 
            }
        }, 
    });

    // Propagation results

    //  text
    setHTML('GDisplay-test3-status', tests.values['Propagation test'].status) // Write status to DOM
    if(tests.values['Propagation test'].status=='Pass'){setColor('GDisplay-test3-status', 'green')} else {setColor('GDisplay-test3-status', 'red')} // Color according to status
    setHTML('GDisplay-test3-result', tests.values['Propagation test'].actual) // Path result from test

    //  graph
    jsnx.draw(result_propagation.tree, { // Draw tree on SVG
        element: '#GDisplay-test3', 
        withLabels: true, 
        labels: 'label',
        labelStyle: {fill: 'black'},
        withEdgeLabels: true,
        edgeLabels: function (d) {
            return d.data.label;
        },
        stickyDrag: true,
        nodeStyle: {
            fill: function(d) { 
                return d.data.color; 
            },
            stroke: 'none',
        }, 
    });

}