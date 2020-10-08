/*

View
====
Description: 
This file contains the scripts to produce the view for the game.

Use: 
This file is called by the main script and calls other functions in other secondary files.

*/

// On start set visualisation SVG to scale dynamically to the window height and width
svgContainerHeight = document.getElementById('svg-container').offsetHeight;
    document.getElementById('svg-main').setAttribute('height', svgContainerHeight);
svgContainerWidth = document.getElementById('svg-container').offsetWidth;
    document.getElementById('svg-main').setAttribute('width', svgContainerWidth);

// Function to set view of game
function initialiseView(gameData, pValueThreshold, currentGameState, currentSystemProgress=0){
    
    // Reset and clear intervention effects
    $('#GUI-policyEffects').hide();
    document.getElementById('GUI-goal-p').style.background = 'none';
    $('#goal-success').hide();

    // Fade in SVG
    setDisplay('svg-main', 'inline-block');
    $('#svg-main')
        .delay(1000)
        .animate({opacity: 1}, 500);

    // Fade in text
    $('#GUI-planetInfo')
        .delay(1000)
        .animate({opacity: 1}, 500);

    // Reset network visualisation
    clearFDG('#svg-main');

    // Initialise graph with pval = bonferroni, settings = mirana + settings.js modifications
    generateGraphFromJSON(gameData.toD3().nodes, gameData.toD3().links, '#svg-main', settings, pValueThreshold); 

    // Set objective text, progress and icon       
        if(gameData.objective.good){ // If objective is to increase a good trait

            // Set objective text
            setText('goal', `Raise ${gameData.objective.label}`);

            // Set direction indicating arrow
            document.getElementById('goal-indicator').className = 'fas fa-chevron-up chevron-pos';

        } else { // If objective is to reduce a bad trait

            // Set objective text
            setText('goal', `Lower ${gameData.objective.label}`);

            // Set direction indicating arrow
            document.getElementById('goal-indicator').className = 'fas fa-chevron-down chevron-neg';
        }    

        // Set objective icon
        document.getElementById('goal-icon').src = gameData.objective.icon;

    // Set system planet image and name
    
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

    // Set node sizes
    for(const [key, node] of Object.entries(gameData.nodes)){setNodeSize(node)};

    // Function to generate random number (from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}

// Feedback intervention effects
function highlightEdges(paths){
    var count = 0; // Count of edges already displayed, increment ot increase delay between successive edges in path

    for (const path of paths) {

        // Construct edges from node path
        const edge = gameData.edges[gameData.getEdgeId(path.source, path.target)];
            const startingLineWidth = d3.select(`#edge_${edge.id}`).attr("stroke-width");

        // Animate edges in path
        d3.select(`#edge_${edge.id}`)
            .transition()
            .delay(function(){return(500*count)})
            .duration(2000)
            .attr("stroke-width", Number(startingLineWidth) + 10);
        setTimeout(function(){ 
            d3.select(`#edge_${edge.id}`)
                .transition()
                .duration(2000)
                .attr("stroke-width", Number(startingLineWidth));
        }, 2000 + (500*count));

        // Show effects on nodes in path
        const targetNode = gameData.nodes[path.target];
        setTimeout(function(){ 

            // Set size
            setNodeSize(targetNode); 

            // Set color
            setNodeColor(targetNode); 
            
        }, 2000 + (500*count));
        
        // Increment path count to stagger highlights
        count++;
    }
}

/* Functions to feedback intervention effects on nodes and edges */

    // Set node sizes
    function setNodeSize(node){
        d3.selectAll("image").style('opacity', 0.3)// TEMP

        // Scale circle radius by how much this node's prevalence has changed
        var circleRadius = settings.nodes.circleRadius / 100 * (100 + node.change);

        // Clamp circle radius within minimum and maximum limits
        circleRadius = Math.min(settings.nodes.circleRadius_max, circleRadius);
        circleRadius = Math.max(settings.nodes.circleRadius_min, circleRadius);

        // Update node's circle radius value for access by other methods
        node.circleRadius = circleRadius;
        
        // Scale node circle and icon size to prevalence
        
        console.log('setting size of', circleRadius)
        d3.select(`#${node.id}`).select("circle").transition()
            .duration(500)
            .attr("r", circleRadius);

        d3.select(`#${node.id}`).select("image").transition()
            .duration(500)
            .attr("x", -circleRadius)
            .attr("y", -circleRadius)
            .attr("height", circleRadius * 2)
            .attr("width", circleRadius * 2);
    };

    // Set node sizes
    function setNodeColor(node){

        // Determine whether a node is a good or bad trait
        
        // Color node changes according to whether they are good or bad effects
        d3.select(`#${node.id}`).select('circle')
            .transition().duration(2000)
            .style("fill", d3.interpolateRdYlGn(node.change/100))
    };

    // Highlight nodes in path
    function highlightPathTo(source, target){
        const path = jsnx.bidirectionalShortestPath(gameData.G, source, target);    

        for (i = 0; i < path.length; i++) {
            if(i+1 == path.length){break;}

            // Construct edges from node path
            const edge = gameData.edges[gameData.getEdgeId(path[i], path[i+1])];
            const startingLineWidth = d3.select(`#edge_${edge.id}`).attr("stroke-width");
            console.log(i)
            // Animate edges in path
            d3.select(`#edge_${edge.id}`)
                .transition()
                .delay(function(){return(1000*i)})
                .duration(2000)
                .attr("stroke-width", startingLineWidth*1 + 10);
            setTimeout(function(){ 
                d3.select(`#edge_${edge.id}`)
                    .transition()
                    .duration(2000)
                    .attr("stroke-width", startingLineWidth);
            }, 2000 + (1000*i));
        }
    }

// Function to display policy effects
function showPolicyEffects(effects){

    // Clear previous effects
    document.getElementById('policyEffects-sideeffects').innerHTML = '';

    // Show effects
    $('#GUI-policyEffects').show();

    var count = 0;
    // Show side-effects
    for(const [key, value] of Object.entries(effects)){

        // Show the main objective differently
        if(key == gameData.objective.id){
            document.getElementById('GUI-goal-p').style.background = 'green';
            $('#goal-success').show();
            continue;
        } 

        // Create trait effect bubble showing trait effect
        constructTraitEffectBubble(key, value, `policyEffect-${count}`, 'policyEffects-sideeffects');
        
        // Fade in
        $(`#policyEffect-${count}`).animate({opacity: 1}, 500 + (500*count));

        // Increment count
        count++;
    }  
}

// Function to construct a trait effect bubble
function constructTraitEffectBubble(nodeId, b, bubbleId, parentId, tense='past'){

    // Get node information
    const node = gameData.nodes[nodeId];
    
    // Div containing effect information
    var div = document.createElement('DIV');
        div.className = 'policyEffect m-2';
        div.id = bubbleId;
    document.getElementById(parentId).appendChild(div);
    
    // Trait icon
    var img = document.createElement('IMG');
        img.src = node.icon;
        img.className = 'policyEffect-img'
    div.appendChild(img);

    // Determine effect direction
    var effectDirection = 'Raised'; 
    var effectDirectionIcon = `fas fa-angle-up col-pos m-1`; 
        if(b<0){
            effectDirection = 'Lowered';
            effectDirectionIcon = 'fas fa-angle-down col-neg m-1'
        };
        if(tense=='future'){
            if(b<0){effectDirection = 'Lower'}
            else {effectDirection = 'Raise'};
        }
        
        // Effect direction indicator
        var i = document.createElement('I');
            i.className = effectDirectionIcon;
        div.appendChild(i);
    
        // Trait name
        var span = document.createElement('SPAN');
            span.innerText = ` ${effectDirection} ${node.label}`;
        div.appendChild(span);

}

// Show win score screen
function showScoreScreen(gameData, intervention){

    // Reset score screen
        // Reset progress bar
        setHTML('win-screen-systemProgress', '');
    
        // Reset score values
        setText('score-goal', '');
        setText('score-goodness', '');
        setText('score-time', '');
        setText('score-award', '');
        setText('score-total', '');

        // Reset awards
        setHTML('score-awards', '');

    // Show win screen
    $('#win-screen').show().animate({opacity: 1}, 500);

    // Play win screen sound
    progressSound.play();

    // Populate win screen

        // Create progress
        createProgress('win-screen-progress-div', 'win-screen-systemProgress', 'progress-goal-div');
    
        // Show scores
        setTimeout(function(){
            showScore();
        }, 1000);

        // Show all awards (awards: strongest effects the intervention had)
        setTimeout(function(){
            showAwards();
        }, 4500);

        // Function to iterate through and show scores
        var scores = [];
            for(const [score, value] of Object.entries(intervention.scores)){
                scores.push({score: score, value: value});
            };
        function showScore(){

            const score = scores.shift();

            // Get element to write score to
            var elementId = null; // Id of element containing score text
            switch(score.score){
                case 'objective': elementId = 'score-goal'; break;
                case 'goodness': elementId = 'score-goodness'; break;
                case 'time': elementId = 'score-time'; break;
                case 'awards': elementId = 'score-award'; break;
                case 'total': elementId = 'score-total'; break;
            }

            // Set score
            setText(elementId, to4SF(score.value));

            // Update progress bars
            if(!(elementId == 'score-award') && !(elementId == 'score-total')){ // Skip award bar since this is added seperately after
                updateProgress(score.value);
            }

            // Loop through all scores to set
            if(scores.length>0){
                setTimeout(function(){
                    showScore(scores);
                }, 850);
            }
        }
        
        // Iterate through and show awards
        var awards = [];
            for(const [award, winner] of Object.entries(intervention.awards)){
                if(winner.id){awards.push({award: award, winner: winner})}
            };

        function showAwards(){
            const award = awards.shift();
            
            // Construct award

                // Create div to hold award
                var div = document.createElement('DIV');
                    div.id = `score-award-${award.award}`;
                    div.opacity = 0;
                    div.className = 'card award m-1';
                document.getElementById('score-awards').appendChild(div);

                var header = document.createElement('DIV');
                    header.className='card-header fnt-bold p-1 col-light bg-dark text-center';
                    // Title div with award name
                    switch(award.award){
                        case 'mostIncreased': header.innerText = 'Most increased'; break;
                        case 'mostDecreased': header.innerText = 'Most decreased'; break;
                        case 'mostGood': header.innerText = 'Best effect'; break;
                        case 'mostBad': header.innerText = 'Worst effect'; break;
                        default: break;
                    };
                div.appendChild(header);

                var body = document.createElement('DIV');
                    body.className='card-body p-1';
                    body.id=`score-award-body-${award.award}`;
                div.appendChild(body);

                var footer = document.createElement('DIV');
                    footer.className='card-footer text-muted p-1';
                    footer.style.borderTop = 'none';
                    // End award with effect on score
                    switch(award.award){
                        case 'mostIncreased': footer.innerHTML = `Score <i class="fas fa-chevron-up" style='color: green'></i>`; break;
                        case 'mostDecreased': footer.innerHTML = `Score <i class="fas fa-chevron-up" style='color: green'></i>`; break;
                        case 'mostGood': footer.innerHTML = `Score <i class="fas fa-chevron-up" style='color: green'></i><i class="fas fa-chevron-up" style='color: green'></i>`; break;
                        case 'mostBad': footer.innerHTML = `Score <i class="fas fa-chevron-down" style='color: red'></i>`; break;
                        default: break;
                    };
                div.appendChild(footer);

                // Add award winning effect bubble
                constructTraitEffectBubble(award.winner.id, award.winner.b, `score-award-bubble-${award.award}`, `score-award-body-${award.award}`);
                $(`#score-award-bubble-${award.award}`)
                    .css('opacity', 1);

            // Fade in award 
            $(`#score-award-${award.award}`)
                .animate({opacity: 1}, 850);

            // Award system progress value   
            switch(award.award){
                case 'mostIncreased': updateProgress(0.25); break;
                case 'mostDecreased': updateProgress(0.25); break;
                case 'mostGood': updateProgress(0.5); break;
                case 'mostBad': updateProgress(-0.25); break;
                default: break;
            };

            // Loop if there are awards left
            setTimeout(function(){
                if(awards.length > 0){
                    showAwards(awards);
                }
            }, 1000)
        }

        // Function to advance progress bars
        function updateProgress(value){

            // Get current value
            var progress = Number(document.getElementById('progress-goal').getAttribute('aria-valuenow'));

            // Update progress bar values
            setProgress('progress-goal-div', progress + value);
            setProgress('win-screen-progress-div', progress + value);
            
            // Update score remaining text
            const scoreToNextSystem = to4SF(Math.max(gamestates[gameState].leagueProgressMax - (progress + value), 0));
            setText('win-screen-progress-text', scoreToNextSystem);
            
            // If system complete, alter progress to show this
            if(scoreToNextSystem <= 0){
                setHTML('GUI-currentSystem', `System complete &nbsp;<i class="fas fa-check-circle"></i>`)
                document.getElementById('progress-goal').className = 'progress-bar progress-bar-striped progress-bar-animated bg-success';
            }
        }
}

// Significant figures function
function to4SF(number){
    const absoluteValue = Math.abs(number); // Get the absolute value

    if (absoluteValue == 0){
        return number.toFixed(0)
    } else if (absoluteValue < 0.0001){
        return number.toFixed(5)
    } else if(absoluteValue < 0.001){
        return number.toFixed(4)
    } else if(absoluteValue < 0.01){
        return number.toFixed(3)
    } else if(absoluteValue < 0.1){
        return number.toFixed(2)
    } else if(absoluteValue < 1){
        return number.toFixed(1)
    } else if(absoluteValue < 10){
        return number.toFixed(1)
    } else if(absoluteValue < 100){
        return number.toFixed(0)
    } else {
        return number.toFixed(0)
    }
}