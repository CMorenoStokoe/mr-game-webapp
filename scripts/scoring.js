/*

Intervention scoring system
===========================
Description: 
This script scores the effectiveness of user made interventions in various ways.

Use:
This script is called by the main model script to score interventions in-visualisation and in-game.
It can also be called individually as a tool to score interventions on request.

*/


// Function to get score for policy
function scoreIntervention(data, method='game', interventionEffects=null, numberOfInterventions=1){

    // Score intervention results by data type and method
    switch(method){

        case 'game':
            return scoringMethod_game(interventionEffects, numberOfInterventions);
        
        case 'test':
            return scoringMethod_test(data);

        case 'none':
            return null;
        
        default: console.log(`ERROR #01: Scoring could not be done (method ${method} not recognised)`);
    }
    
}

// Scoring system for testing: Score the results of propagation (i.e., an intervention) without scaling or game modification
function scoringMethod_test(gameData){

    // Init scores
    var objectiveScore = 0;
    var goodnessScore = 0;
    var changedNodes = [];

    // Score intervention effects on node prevalences
    for(const [id, node] of Object.entries(gameData.nodes)){

        // Effects: Push affected nodes to list
        if(node.change > 0){changedNodes.push(node)};

        // Goodness Score: Score whether effect on node was good or bad
        var goodness = 0;
        if(node.isGood){
            goodness += node.change;
        }else{
            goodness -= node.change;
        }
        goodnessScore += goodness;

        // Objective Score: Score effect on the objective
        if(id == gameData.objective.id){
            if(node.isGood){
                objectiveScore += node.change;
            }else{
                objectiveScore -= node.change;
            }
        }
    }

    // Return scores
    return({
        scores: {
            objective: objectiveScore, 
            goodness: goodnessScore,
        },
        effects: changedNodes,
    })

}

// Scoring system for the game: Score current node prevalence changes in game data (i.e., overall changes not specific to one intervention)
function scoringMethod_game(interventionEffects, numberOfInterventions){
    var objectiveScore = 0;
    var timeScore = 0;
    var efficiencyScore = 0;

    // Calculate goodness score
    
        // Initialise lists
        var goodEffects = [];
        var badEffects = [];

        // Populate lists with good/bad effects
        for(const [id, effect] of Object.entries(interventionEffects)){

            // Score whether effect on node was good or bad
            if(gameData.nodes[id].isGood){
                goodEffects.push({id: id, effect: effect});
            }else{
                badEffects.push({id: id, effect: effect});
            }
        
        }

    // Calculate efficiency score compared to best intervention possible
    const efficiency = calcInterventionEfficiency(interventionEffects, numberOfInterventions);
    
        // Check if there was a possible better intervention
        if(efficiency){ efficiencyScore = Math.abs(efficiency.score); } // % of best intervention
        else{ efficiencyScore = 100 }

    // Calculate objective score
    objectiveScore = gameData.objective.change; // % change in objective

    // Return scores
    return({
        scores: {
            objective: objectiveScore, 
            goodness: badEffects.length / goodEffects.length * 100,
            time: timeScore,
            efficiency: efficiencyScore,
        },
        weighting: {  // Weighting of scores for exp levelling
            objective: 1, 
            goodness: 1,
            time: 1,
            efficiency: 1,
        },
        efficiency: efficiency,
    })
}

// Calculate intervention efficiency
function calcInterventionEfficiency(interventionEffects, numberOfInterventions=1){

    // Calculate best possible interventions
    const optimalInterventions = calcOptimalIntervention(gameData, EvE.data); // Get top 5 interventions
    
    // Get player effect(s)
    const playerEffect = interventionEffects[gameData.objective.id];

    // Return most effective possible intervention (if any)
    if(optimalInterventions.length > 0){
        var bestEffect = 0;

        // Get optimal effect(s)
        for (i = 0; i < numberOfInterventions; i++) {

            // Get ith most optimal intervention
            const optimalIntervention = optimalInterventions[i]; // Single best intervention

            // Add effect to optimal effect(s)
            bestEffect += optimalIntervention.objectiveEffect;
        }
            
        console.log(bestEffect);
        // Calculate efficiency
        console.log(playerEffect, bestEffect, playerEffect / bestEffect * 100)
        var efficiency = to2DP(playerEffect / bestEffect * 100);
            if(playerEffect == undefined){efficiency = 0;} // Avoid divide by 0 issue

            console.log(efficiency);
        
        return({score: efficiency, optimalInterventions: optimalInterventions})

    } 

    // Else if no possible intervention
    else {
        return false
    };

};

// Calculate awards
function calculateAwards(){
  
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
};

// Calculate exp from score
function calculateExp(node, nodePrevalenceChange, efficiency){

    // Standardise effect as % change in prevalence
    const stdConst = standardise(node).prevalenceChangePerUnit; // standardise.js
    const effect = nodePrevalenceChange*stdConst;

    // Score based on if effect was good or bad
    var score = node.isGood ? effect : -effect; 
        if(nodePrevalenceChange == 0){score = 0};

    // Clamp to within range
    score = Math.max(0, Math.min(100, score));
        
    // Only gain exp not lose it
    return score>0 ? score : 0
}

// Calculate level from current exp
function calculateLevel(playerExp, levels){

    // Search levels and get correct level for player exp
    for(const [key, level] of Object.entries(levels)){
        if(playerExp < level.max){return level.id};
    }
}