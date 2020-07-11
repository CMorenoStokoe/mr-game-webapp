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
    
    // Display current graph information
    G = tremauxTrees[0].g// Get graph for tree
    title = tremauxTrees[0].title // Get title for tree
    label = tremauxTrees[0].label // Get label for tree
    disabled = tremauxTrees[0].disabled // Get development stage; disabled or enabled

    jsnx.draw(G, { // Draw tree on SVG
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

    // Grayscale graph if disabled
    if(disabled){ document.getElementById('GDisplay-svg').style.webkitFilter = "grayscale(100%) blur(1px)";console.log(disabled);} else {document.getElementById('GDisplay-svg').style.webkitFilter = ''}

    setHTML('GDisplay-title', title); // Set display title to label
    setHTML('GDisplay-subtitle', label); // Set display title to label

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
    const tree = currentTree.g; // Get tree G object
    const answers = currentTree.answers // Get correct solutions to tree

    // Run tests
    const result_selfloop = test_selfloop(tree); // Identify and remove self-loops
    const result_traversal = test_traversal(tree); // Search network and get path of order in which to search nodes
    const result_propagation = test_propagation(result_traversal.path); // Use traversal path for propagation

    // Test results against expected values
    tests = validate([
        {name: 'Self-loop test', expected: JSON.stringify(answers.selfloops), actual: JSON.stringify(result_selfloop.selfloops)},
        {name: 'Traversal test', expected: JSON.stringify(answers.traversal), actual: JSON.stringify(result_traversal.path.nodes)},
        {name: 'Propagation test', expected: JSON.stringify(answers.propagation), actual: JSON.stringify(result_propagation.info)},
    ])
    
    document.getElementById("test_log").innerHTML = ''; // Reset result text on DOM
    document.getElementById("badge-results").innerHTML='';

    if (tests['failed'].length > 0) { // Write results
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
            G_sl.addNode(node, {color: n[node][1].color});
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
    console.log(tests.values)
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