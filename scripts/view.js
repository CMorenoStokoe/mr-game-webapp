/*

View
====
Description: 
This file contains the scripts to:
- Initialise visualisation and UI
- Update the visualisation
- Change UI elements

Use: 
This file is called by the main script and calls other 
functions in other secondary files.

*/


/* Initialise view */

// Scale SVG to window
svgContainerHeight = document.getElementById('svg-container').offsetHeight;
    document.getElementById('svg-main').setAttribute('height', svgContainerHeight);
svgContainerWidth = document.getElementById('svg-container').offsetWidth;
    document.getElementById('svg-main').setAttribute('width', svgContainerWidth);

// Initialise visualisation and UI
function initialiseView(
        profile,
        gameData, 
        pValueThreshold, 
        currentGameState, 
        currentSystemProgress=0
    ){

    switch(profile){

        case 'visualisation':

            // Generate visualisation
            generateGraphFromJSON(gameData.toD3().nodes, gameData.toD3().links, '#svg-main', settings, pValueThreshold); 

            // Configure view
            fadeIn_SVG();
            setUI_objective();

            break;

        case 'interactiveVisualisation':

            // Reset view
            reset_SVG();

            // Generate visualisation
            generateGraphFromJSON(gameData.toD3().nodes, gameData.toD3().links, '#svg-main', settings, pValueThreshold); 

            // Configure view
            setUI_objective();
            fadeIn_SVG();

            break;

        case 'game':

            // Reset view
            reset_effectsPanel();
            reset_SVG();

            // Generate visualisation
            generateGraphFromJSON(gameData.toD3().nodes, gameData.toD3().links, '#svg-main', settings, pValueThreshold); 

            // Configure view
            setUI_objective();
            setUI_planetInfo();
            fadeIn_SVG();
            fadeIn_planetInfo();

            break;

        default: console.log(`ERR: Unknown settings profile (${profile})`); break;
    }

    // Reset intervention effects read-out panel
    function reset_effectsPanel(){
        $('#GUI-policyEffects').hide();
        document.getElementById('GUI-goal-p').style.background = 'none';
        $('#goal-success').hide();
    }

    // Reset network visualisation
    function reset_SVG(){
        clearFDG('#svg-main'); // edit-element.js
    }

    // Fade in SVG
    function fadeIn_SVG(){
        setDisplay('svg-main', 'inline-block'); // edit-elements.js
        $('#svg-main').delay(1000).animate({opacity: 1}, 500);
    }

    // Fade in text
    function fadeIn_planetInfo(){
        $('#GUI-planetInfo').delay(1000).animate({opacity: 1}, 500);
    }

    // Set objective text, progress and icon    
    function setUI_objective(){
        
        // Set objective indicator
        document.getElementById('goal-icon').src = gameData.objective.icon; // Set icon 
        if(gameData.objective.isGood){
            setText('goal', `Raise ${gameData.objective.label}`);
            document.getElementById('goal-indicator').className = 'fas fa-chevron-up chevron-pos';
        } else {
            setText('goal', `Lower ${gameData.objective.label}`);
            document.getElementById('goal-indicator').className = 'fas fa-chevron-down chevron-neg';
        }
    }   

    // Set system planet image and name
    function setUI_planetInfo(){

        // Set system name
        setHTML('GUI-currentSystem', `${currentGameState.leagueName} system`);

        // Set system progress
        setProgress('progress-goal-div', currentSystemProgress, {min:0, max: currentGameState.leagueProgressMax});
        document.getElementById('progress-goal').className = 'progress-bar progress-bar-striped progress-bar bg-primary';
        console.log('set progress:', currentSystemProgress, {min:0, max: currentGameState.leagueProgressMax})

        // Randomly select a planet
        const planetName = planetNames[getRandomInt(planetNames.length)];
        const planetGraphic = planetGraphics[getRandomInt(planetGraphics.length)];

        // Set planet name
        setText('GUI-currentPlanet', `${planetName}`);

        // Set planet image
        var planet = document.getElementById('GUI-planet').style;
            planet.background = `url("images/planets/${planetGraphic}.png") no-repeat`;
            planet.backgroundPosition = '150px 0px';
            planet.backgroundSize= '800px 800px';
    }
}


/* Show intervention effects */


// Show intervention propagating through network
function showInterventionEffects(paths, interval = 2500){

    // Filter paths to show unique edges only
    var dictionaryFilter = {};
        for(const edge of paths){dictionaryFilter[`${edge.source}${edge.target}`]=edge}
    var uniqueEdges = [];
        for(const [key, uniqueEdge] of Object.entries(dictionaryFilter)){uniqueEdges.push(uniqueEdge)}
    paths = uniqueEdges;

    // Show effects for each unique edge in the path
    iteratePaths(paths);

    // Iterate paths and show effects
    function iteratePaths(edges){

        // Get edge from path array
        const path = edges.shift();

        /* Show intervention effect pathways */

            // Get edge width
            const edge = gameData.edges[gameData.getEdgeId(path.source, path.target)];
                const startingLineWidth = d3.select(`#edge_${edge.id}`).attr("stroke-width");

            // Grow edges to highlight them
            d3.select(`#edge_${edge.id}`)
                .transition()
                .duration(interval/2)
                .attr("stroke-width", (Number(startingLineWidth) * 2) + 2);
            
            // Shrink them back to normal
            setTimeout(function(){ 
            d3.select(`#edge_${edge.id}`)
                .transition()
                .duration(interval/2)
                .attr("stroke-width", Number(startingLineWidth));
            }, interval/2);

            // Animate labels to pop up
            showLabel(path.target); showLabel(path.source);
            setTimeout(function(){
                hideLabel(path.target); hideLabel(path.source);
            },interval-50)
            

        /* Show intervention's effects on each nodes' prevalence */

            // Get target node in this edge
            const targetNode = gameData.nodes[path.target];
            
            // Set node size
            formatNode(targetNode); 

            // Update node information labels
            updateLabel(targetNode, interval/2)


        // Self loop until all effects shown
        if(edges.length>0){
            // Show intervention effects on nodes and edges in simulation
            setTimeout(function(){
                iteratePaths(edges);
            }, interval);
        }
    }    
}


/* Update visualisation */


// Format nodes so they scale with their prevalence values
function formatNode(node, interval = 500){

    // Calculate node size
    var circleRadius = settings.nodes.circleRadius / 100 * (100 + node.change);
        circleRadius = Math.min(settings.nodes.circleRadius_max, circleRadius);
        circleRadius = Math.max(settings.nodes.circleRadius_min, circleRadius);
        
        // Scale by area instead of radius
        circleRadius = Math.sqrt(circleRadius*100 / 3.14);
        
        // Record value for access by other methods
        node.circleRadius = circleRadius; 
    
    // Calculate node color
    var color = null;
        switch(isGood[node.id]){ // Scale color to show whether changes are good or bad
            case true: color = d3.interpolateRdYlGn(0.5 + (node.change / 100)); break;
            case false: color = d3.interpolateRdYlGn(0.5 - (node.change / 100)); break;
            default: color = 'LEMONCHIFFON'; break;
        }
        if(node.change==0){color='white'}; // Color no change white

    // Format node to scale with prevalence
    d3.select(`#${node.id}`).select("circle").transition()
        .duration(interval)
        // Set node radius to prevalence
        .attr("r", circleRadius)
        // Set node color to prevalence
        .style("fill", color);

    d3.select(`#${node.id}`).select("image").transition()
        .duration(interval)
        // Set node image size to prevalence
        .attr("x", -circleRadius)
        .attr("y", -circleRadius)
        .attr("height", circleRadius * 2)
        .attr("width", circleRadius * 2);

    // Fix label positions
    d3.select(`#${node.id}`).select("text").attr("y", circleRadius+20);
    d3.select(`#${node.id}`).select("rect").attr("y", circleRadius);
    d3.select(`#${node.id}`).select("g").select("g")
        .attr('transform', `translate(
            ${0},
            ${settings.nodes.labels.backgroundHeight + circleRadius})`
        );
    d3.select(`#badge_${node.id}`)
        .attr('x', circleRadius * Math.cos(45))
        .attr('y', - circleRadius * Math.sin(45))
    
};

// Show node labels
function showLabel(nodeId){

    // Show labels
    d3.select(`#${nodeId}`).select("g").transition() // Label animation
        .duration(300)
        .style("opacity", 1);
}

// Hide labels
function hideLabel(nodeId){

    // Make labels transparent
    d3.select(`#${nodeId}`).select("g").transition() // Label animation
        .duration(300)
        .style("opacity", 0);
}

// Update label position and text
function updateLabel(node, duration = 500){

    // Update prevalence information
    d3.select(`#prevTxt_${node.id}`)
        .text(`${to4SF(node.prevalence)} ${node.units}`);
    d3.select(`#prevBar_${node.id}`)
        .transition()
        .duration(duration)    
        .attr("width", Math.min(100, Math.max(0, // Min 0% width, max 100% width
            settings.nodes.labels.backgroundWidth()/2 + node.change
        )));

    // Set change indicator
    d3.select(`#badge_${node.id}`)
        .text(function(d) { 
            if(node.change<0){return '\uf13a' }
            else if(node.change>0){return '\uf139' }
            else{return ''}
        })
        .attr('fill', function(d) { 
            if(node.change<0){return settings.links.colNeg}
            else{return settings.links.colPos};
        }); 
}

// Highlight an indiviual node
function highlightNode(nodeId){
    
    // Enlarge circle
    d3.select(`#${nodeId}`).select("circle")
        .attr("r", settings.nodes.circleRadius*2)
        .style("fill", 'gold');
    d3.select(`#${nodeId}`).select("image")
        .attr("x", -settings.nodes.circleRadius*2)
        .attr("y", -settings.nodes.circleRadius*2)
        .attr("height", settings.nodes.circleRadius * 4)
        .attr("width", settings.nodes.circleRadius * 4);

    // Update circle radius in data
    gameData.nodes[nodeId].circleRadius *= 2;
}

/* Highlight nodes in path
function highlightPathTo(source, target, interval = 500){

    // Calculate path from source node to target
    const path = jsnx.bidirectionalShortestPath(gameData.G, source, target);    

    // Highlight each edge in the path
    for (i = 0; i < path.length; i++) {
        if(i+1 == path.length){break;}

        // Construct edges from node path
        const edge = gameData.edges[gameData.getEdgeId(path[i], path[i+1])];
        const startingLineWidth = d3.select(`#edge_${edge.id}`).attr("stroke-width");
        
        // Animate edges in path
        d3.select(`#edge_${edge.id}`)
            .transition()
            .duration(interval)
            .attr("stroke", startingLineWidth*1 + 10);
        setTimeout(function(){ 
            d3.select(`#edge_${edge.id}`)
                .transition()
                .duration(interval)
                .attr("stroke", startingLineWidth);
        },interval*i);
    }
}*/


/* Change UI display */


// Hide game UI elements
function hideGameUI(){

    // Hide planet information
    $('#GUI-currentPlanet').hide();
    $('#progress-goal-div').hide();
    $('#GUI-planet').hide();
    $('#GUI-goal').hide();
    document.body.style.background = `ghostwhite`;
}

// Show interactive visualisation GUI
function showInteractiveVisUI(){

    // Add reset button
    $('#reset-button').show();
}

// Show test GUI
function showTestUI(){

    // Modify goal display to set test targets
    $('#GUI-goal').show();
    document.getElementById('GUI-goal').style.color = 'black';
    document.getElementById('GUI-goal').style.textShadow = 'none';
    $('#GUI-goal-h').text('Target');
}