/*

Data model
=========
Description: 
This is a high-level file which controls the data handling functions of the game.

Use:
This function is called by the main script, and calls functions in lower order files.

*/

// Function to create data for the game
function initialiseData(nodes, edges, pValueThreshold){


    /* Filter data */
        
        // Filter out edges above p value threshold
        var filteredEdges = filterByPval(edges, pValueThreshold);

        // Initialise DataClass 
        var gameData = new DataClass(nodes, filteredEdges); // Populate DataClass with gameData


    /* Configure node data */
    for(const [key, value] of Object.entries(gameData.nodes)){

        // Give node values
        gameData.nodes[key].average = nodeValues[key].prevalence;
        gameData.nodes[key].range = nodeValues[key].max - nodeValues[key].min;
        gameData.nodes[key].min = nodeValues[key].min;
        gameData.nodes[key].max = nodeValues[key].max;
        gameData.nodes[key].units = nodeValues[key].units;
        gameData.setPrevalenceValues(key, nodeValues[key].prevalence); // In data-classes

        // Calculate how much this node should increase as a result of a 5% increase intervention
        gameData.nodes[key].prevalenceIncrease = gameData.nodes[key].average * 0.05;

        // Give icon
        gameData.nodes[key].icon = `images/epicons/${icons[gameData.nodes[key].id]}.png`; // Icon assignment in gameData/icons.js
    
        // Give circle radius
        gameData.nodes[key].circleRadius = settings.nodes.circleRadius;

        // Reset values later set
        gameData.nodes[key].exaggeration = 0;

        // Record whether the node is good or bad (i.e., wellbeing is good but diabetes is bad)
        gameData.nodes[key].isGood = isGood[value.id];

        // Reset edge list so we can update this after filtering
        gameData.nodes[key].edges = [];
        
    }

    /* Configure edge data */
    for(const [key, value] of Object.entries(gameData.edges)){

        // Convert beta effect estimate to a % change in the outcome as a result of intervention
        const exposure = gameData.nodes[value['id.exposure']];
        const outcome = gameData.nodes[value['id.outcome']];

        // Calculate percent change in outcome relative to its prevalence value
        value.b_pct = (exposure.prevalenceIncrease * value.b) / outcome.prevalence;

        // Calculate percent change in outcome relative to its min-max value range
        value.b_pctOfRange = (exposure.prevalenceIncrease * value.b) / outcome.range * 100;
        

        // Update nodes' edge lists
        exposure.edges.push(value);
            exposure.edgeCount =  exposure.edges.length;
        outcome.edges.push(value);
            outcome.edgeCount =  outcome.edges.length;
    }    

    /* Simplify and validate data view */

        // Remove unused nodes from data
        for(const [key, value] of Object.entries(gameData.nodes)){
            if(!(value.edges.length>0)){
                delete gameData.nodes[key]; continue;
            };
        }

    /* Return final gameData */
        
        // Update graph data
        gameData.G = gameData.toG();

        // Remove loops from data network
        var loopsRemoved = 0;
        for(const node of gameData.G.nodes()){
            if(gameData.G.successors(node).length>0){
                
                // Find loops
                const loops = removeLoops(gameData.G, node);

                // Remove loops
                loopsRemoved += loops.length;
                gameData.G.removeEdgesFrom(loops);
                gameData.updateEdges(loops);

            }
        }
        
        // Return
        console.log('GAMEDATA: ', gameData, `${loopsRemoved} loops removed`);
        return(gameData);
}


// Function to get score for policy
function scoreInterventionSuccess(gameData){
    var changedNodes = [];
    var mostIncreased = {id:null, b:0};
    var mostDecreased = {id:null, b:0};
    var mostGood = {id:null, b:0, goodness:0};
    var mostBad = {id:null, b:0, goodness:0};

    var objectiveScore = 0;
    var goodnessScore = 0;
    var timeScore = 0;

    // Iterate over nodes and detect changes
    for(const [id, node] of Object.entries(gameData.nodes)){

        // If it has been changed, push to list of nodes changed by this policy
        if(node.change > 0){changedNodes.push(node)};

        // Score whether effect on node was good or bad
        var goodness = 0;
        if(node.isGood){
            goodness += node.change;
        }else{
            goodness -= node.change;
        }
        goodnessScore += goodness;

        // Score effect on the objective (if this node was the objective)
        if(id == gameData.objective.id){
            if(node.isGood){
                objectiveScore += node.change;
            }else{
                objectiveScore -= node.change;
            }
        }

        // Check awards
        if(node.change > mostIncreased.b){mostIncreased = {id: id, b: node.change}} // ? Most increased trait
        if(node.change < mostDecreased.b){mostDecreased = {id: id, b: node.change}} // ? Most decreased trait
        if(goodness > mostGood.goodness){mostGood = {id: id, b: node.change, goodness: goodness,}} // ? Most good done
        if(goodness < mostBad.goodness){mostBad = {id: id, b: node.change, goodness: goodness}} // ? Most bad done
    
    }
    
    // Calculate award score
    var awardScore = 0;
        if(mostIncreased.id){awardScore+=0.25};
        if(mostDecreased.id){awardScore+=0.25};
        if(mostGood.id){awardScore+=0.5};
        if(mostBad.id){awardScore-=0.25};

    // Final weighting of scores
    objectiveScore = boundScoreToRange(objectiveScore);
    goodnessScore = boundScoreToRange(goodnessScore / 4);
    timeScore = boundScoreToRange(timeScore);
    awardScore = boundScoreToRange(awardScore);
    const totalScore = objectiveScore + goodnessScore + timeScore + awardScore;

    // Return scores
    return({
        scores: {
            objective: objectiveScore, 
            goodness: goodnessScore,
            time: timeScore,
            awards: awardScore,
            total: totalScore,
        },
        effects: changedNodes,
        awards: {
            mostGood: mostGood,
            mostBad: mostBad,
            mostDecreased: mostDecreased,
            mostIncreased: mostIncreased,
        }
    })

    // Function to bound scores within min & max
    function boundScoreToRange(score, min=0, max=5){
        return(Math.min(Math.max(min, score), max))
    }
}