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
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    document.getElementById('svg-main').setAttribute('height', vh);
    document.getElementById('svg-main').setAttribute('width', vh);

// Enable popovers
$(function () {$('[data-toggle="popover"]').popover()})

// Initialise visualisation and UI
function initialiseView(
        profile,
        gameData, 
        pValueThreshold, 
        currentGameState, 
        playerExp,
        levels,
        playerLvl
    ){

    switch(profile){

        case 'visualisation':

            // Generate visualisation
            generateGraphFromJSON(gameData.toD3().nodes, gameData.toD3().links, '#svg-main', settings, pValueThreshold);
            //createLegend('graph-legend', 'svg-main', settings, blackText = true, customLabels={'scale': 'Prevalence change (%)', 'pos': 'Increases', 'neg': 'Reduces', 'min': '<5%', 'max': '100%',});

            // Configure view
            fadeIn_SVG();

            break;

        case 'interactiveVisualisation':

            // Reset view
            reset_SVG();

            // Generate visualisation
            generateGraphFromJSON(gameData.toD3().nodes, gameData.toD3().links, '#svg-main', settings, pValueThreshold); 
            //createLegend('graph-legend', 'svg-main', settings, blackText = true, customLabels={'scale': 'Prevalence change (%)', 'pos': 'Increases', 'neg': 'Reduces', 'min': '<5%', 'max': '100%',});

            // Configure view
            setUI_objective(); // Show objective
            fadeIn_SVG();

            break;

        case 'game':

            // Reset view
            reset_SVG();

            // Generate visualisation
            generateGraphFromJSON(gameData.toD3().nodes, gameData.toD3().links, '#svg-main', settings, pValueThreshold); 
            //createLegend('graph-legend', 'svg-main', settings, blackText = true, customLabels={'scale': 'Prevalence change (%)', 'pos': 'Increases', 'neg': 'Reduces', 'min': '<5%', 'max': '100%',});

            // Configure view
            setUI_objective(); // Show objective
            //setUI_planetInfo(); // Show planet
            fadeIn_SVG();
            
            $('.label').css('opacity', 0); // Start node labels hidden

            setExpIndicators(playerExp, levels[playerLvl].max); // Set exp bar
            styleProgressBar('default'); // Set progress bar style

            break;

        default: console.log(`ERR: Unknown settings profile (${profile})`); break;
    }

    /* Reset intervention effects read-out panel
    function reset_effectsPanel(){
        $('#GUI-policyEffects').hide();
        document.getElementById('GUI-goal-p').style.background = 'none';
        $('#goal-success').hide();
    }*/

    // Reset network visualisation
    function reset_SVG(){
        clearFDG('#svg-main'); // edit-element.js
    }

    // Fade in SVG
    function fadeIn_SVG(){
        setDisplay('svg-main', 'inline-block'); // edit-elements.js
        $('#svg-main').delay(750).animate({opacity: 1}, 500); // Fade in to hide force directed graph jiggling on creation
    }

    // Fade in text
    function fadeIn_planetInfo(){
        $('#GUI-planetInfo').delay(1000).animate({opacity: 1}, 500);
    }

    // Set objective text, progress and icon    
    function setUI_objective(){
        
        // If an objective has been set
        if(gameData.objective){

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
    }   

    // Set system planet image and name
    function setUI_planetInfo(){

        // Randomly generate planet in background
        var planet = document.getElementById('GUI-planet').style;
            planet.background = `url("images/planets/${planetGraphics[getRandomInt(planetGraphics.length)]}.png") no-repeat`;
            planet.backgroundPosition = '150px 0px';
            planet.backgroundSize= '800px 800px';
        
        // Set system information
        //setProgress('progress-goal-div', currentSystemProgress, {min:0, max: currentGameState.leagueProgressMax});
        //document.getElementById('progress-goal').className = 'progress-bar progress-bar-striped progress-bar bg-primary';
        //setHTML('GUI-currentSystem', `${currentGameState.leagueName} system`);

        // Set planet name
        //const planetName = planetNames[getRandomInt(planetNames.length)];
        //setText('GUI-currentPlanet', `${planetName}`);

    }

    // Set exp and level indicators
    function setExpIndicators(playerExp, max=levels[playerLvl].max){
        showExpFx(playerExp, max);
    }
}


/* Update visualisation */

// Format nodes so they scale with their prevalence values
function formatNode(node, interval = 500){

    // Calculate node size

        // Scale node size to trait prevalence
        var circleRadius = settings.nodes.scaleCircleArea(node.change);
        
        // Record value for access by other methods
        node.circleRadius = circleRadius; 
    
    // Calculate node color
    var color = settings.nodes.colorSchemeForInterpolation(node);
        if(node.change === 0){color = 'white'};

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
        .text(`${indicateSign(node.change)}${to0SF(node.change)}%`);
    d3.select(`#prevBar_${node.id}`)
        .transition()
        .duration(duration)    
        .attr("width", `${node.change_bar * settings.nodes.labels.backgroundWidth() / 100}`)
        .style("fill", d=>settings.nodes.labels.prevalenceBarColorScheme(d));

    // Set change indicator
    d3.select(`#badge_${node.id}`)
        .text(settings.nodes.labels.indicatorUnicode(node)) // Indicator unicode symbol (arrow)
        .style('fill', settings.nodes.labels.indicatorColor(node)) // Indicator fill color
        .attr("dy", settings.nodes.labels.indicatorPos(node).y) // Indicator position
        .attr("dx", function(){return node.change<0 ? settings.nodes.labels.indicatorPos(node).x + settings.nodes.labels.backgroundWidth()*0.2 : settings.nodes.labels.indicatorPos(node).x - settings.nodes.labels.backgroundWidth()*0.2}) 
        .transition()
        .duration(duration)
        .attr("dx", settings.nodes.labels.indicatorPos(node).x) // Indicator position
}

// Highlight an indiviual node
function highlightNode(nodeId, fill='gold'){
    
    // Enlarge circle
    d3.select(`#${nodeId}`).select("circle")
        .attr("r", settings.nodes.circleRadius*2)
        .style("fill", fill);
    d3.select(`#${nodeId}`).select("image")
        .attr("x", -settings.nodes.circleRadius*2)
        .attr("y", -settings.nodes.circleRadius*2)
        .attr("height", settings.nodes.circleRadius * 4)
        .attr("width", settings.nodes.circleRadius * 4);

    // Update circle radius in data
    gameData.nodes[nodeId].circleRadius *= 2;
}

// Highlight edge
function highlightEdge(id, interval = 2500){

    // Get edge by id
    var edge = d3.select(id);

    // Get initial edge width
    const startingLineWidth = d3.select(id).attr("stroke-width");

    // Grow edges to highlight them
    edge
        .style('opacity', 1)
        .transition()
        .duration(interval/2)
        .attr("stroke-width", (Number(startingLineWidth) * 2) + 2);

    // Shrink them back to normal
    setTimeout(function(){ 
        edge
            .transition()
            .duration(interval/2)
            .attr("stroke-width", Number(startingLineWidth))
    }, interval/2);
}

// Hide all labels
function hideAllLabels(nodes){
    for(const [id, node] of Object.entries(nodes)){
        hideLabel(id);
    }
}
function showAllLabels(nodes){
    for(const [id, node] of Object.entries(nodes)){
        showLabel(id);
    }
}

// Set opacity of nodes
function setNodeOpacity(value){
    
    d3.selectAll('circle').style('opacity', value);
    d3.selectAll('image').style('opacity', value);

}

// Set opacity of edges
function setEdgeOpacity(value){
    
    for(const [id, edge] of Object.entries(gameData.edges)){
        d3.select(`#edge_${id}`).style('opacity', value);
        d3.select(`#edge_${id}_outline`).style('opacity', value);
    }
}

// Highlight node
function focusOnNode(id, transparency = 0.3, interval = 2500, fadeOut=true){

    const sourceNodeG = d3.select(`#${id}`);
    sourceNodeG.select("circle").style('opacity', 1);
    sourceNodeG.select("image").style('opacity', 1);
    if(fadeOut){
        setTimeout(function(){ 
            sourceNodeG.select("circle").style('opacity', transparency);
            sourceNodeG.select("image").style('opacity', transparency);
        }, interval);
    }
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
    $('#iv_reset').show();
}

// Show test GUI
function showTestUI(){

    // Reset UI
    document.getElementById('test_score_objective').innerText = '-';
    document.getElementById('test_score_goodness').innerText = '-';
    document.getElementById('test_allEffects').innerHTML = '';
    document.getElementById('test_interventions').innerHTML = '';

    // Modify goal display to set test targets
    $('#GUI-goal').show();
    document.getElementById('GUI-goal').style.color = 'black';
    document.getElementById('GUI-goal').style.textShadow = 'none';
    $('#GUI-goal-h').text('Target');

    // Show options form
    $('#test_settings').show();
}

// Convey vis results
function conveyVisResults(){
    // Convey results
    document.getElementById('test_score_objective').innerText = to4SF(score.scores.objective);
    document.getElementById('test_score_goodness').innerText = to4SF(score.scores.goodness);
    document.getElementById('test_allEffects').innerHTML += `<hr> Intervention on ${gameData.nodes[nodeId].label} <hr>`;
    for(const [nodeId, prevalenceChange] of Object.entries(results.result)){
        document.getElementById('test_allEffects').innerHTML += `${gameData.nodes[nodeId].label} changed by ${to4SF(prevalenceChange)} <br>`;
    };   
}

// Set background
function setBG(value=null){
    if(value){
        document.getElementById('container-4-bg').style.background = `url("images/spaceboxes/${value}.jpg") no-repeat center center fixed`;
        document.getElementById('container-4-bg').style.backgroundSize = 'cover';
    }else{
        document.getElementById('container-4-bg').style.background = `url("images/spaceboxes/${getRandomInt(8)}.jpg") no-repeat center center fixed`;
        document.getElementById('container-4-bg').style.backgroundSize = 'cover';
    }
}

/* level and exp */

// Show player exp effects
function showExpFx(playerExp, max=100){

    // Set exp bar
    setProgress('progress-goal-div', playerExp, range = {min: 0, max: max,}); // Progress bar    
    setHTML('GUI-currentSystem', `${Math.min(100, to0SF(playerExp / levels[playerLvl].max * 100))}%`); // Text

}

// Style progress bar
function styleProgressBar(style='default'){

    switch(style){

        case 'lvl-up':

            // Format progress to level up
            setHTML('GUI-currentSystem', `Level up! &nbsp <i class="fas fa-fire"></i>`)
            document.getElementById('progress-goal').className = 'progress-bar progress-bar-striped progress-bar-animated bg-primary';
            
            break;

        case 'intervention-max':

            // Format progress to continue
            setHTML('GUI-currentSystem', `Enact policy &nbsp <i class="fas fa-calendar-check"></i>`)
            document.getElementById('progress-goal').className = 'progress-bar progress-bar-striped progress-bar-animated bg-success';
            break;
        
        default:

            // Format progress default 
            document.getElementById('progress-goal').className = 'progress-bar progress-bar-striped progress-bar-animated bg-info';
            break;
    }
}


/*
// Set edge color
function setEdgeColor(d){
    
    const target = d.target;
    const source = d.source;

    const effectIsIncrease = d.b>0;
    const targetIsGood = target.isGood;
    
    console.log(target, source, effectIsIncrease, targetIsGood);

    const effectIsGood = effectIsIncrease == targetIsGood;

    const valueToAdd = effectIsGood ? 0.25 : -0.25;
    var value = 0.5 + valueToAdd;

    return d3.interpolateRdYlGn(value);

}
*/