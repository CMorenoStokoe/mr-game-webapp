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
function scoreIntervention(data, method='game', gameData=null, playerInterventionMax=null, EvE=null){

    // Score intervention results by data type and method
    switch(method){

        case 'game':
            return scoringMethod_game(data, gameData, playerInterventionMax, EvE);
        
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
function scoringMethod_game(gameData){
    var objectiveScore = 0;
    var goodnessScore = 0;
    var timeScore = 0;
    var efficiencyScore = 0;

    // Calculate goodness score
    var goodEffects = [];
    var badEffects = [];
    for(const [id, node] of Object.entries(gameData.nodes)){

        // Score whether effect on node was good or bad
        var goodness = 0;
        if(node.isGood){
            goodEffects.push();
        }else{
            goodness -= node.change;
        }
        goodnessScore += goodness;
    
    }

    // Calculate efficiency score compared to best intervention possible
    const efficiency = calcInterventionEfficiency(gameData, EvE);
        efficiencyScore = efficiency.score; // % of best intervention

    // Calculate objective score
    objectiveScore = gameData.objective.change; // % change in objective

    // Return scores
    return({
        scores: {
            objective: objectiveScore, 
            goodness: goodnessScore,
            time: timeScore,
            efficiency: efficiencyScore,
        },
        weighting: {  // Weighting of scores for exp levelling
            objective: 1, 
            goodness: 1,
            time: 1,
            efficiency: 1,
        },
        efficiency: {
            score: efficiency.score, 
            optimalInterventions: efficiency.optimalInterventions, 
        }
    })
}

// Calculate intervention efficiency
function calcInterventionEfficiency(gameData, EvE){

    // Calculate best possible interventions
    const optimalInterventions = calcOptimalIntervention(gameData.objective.id, gameData.nodes, 5, EvE.data); // Get top 5 interventions
    
    // Compare player efficiency to most optimal intervention
    const optimalIntervention = optimalInterventions[0]; // Single best intervention
        const bestEffect = optimalIntervention.objectiveEffect;
        const playerEffect = gameData.objective.change_raw;

    const efficiency = to2DP(playerEffect / bestEffect * 100);
    
    return({score: efficiency, optimalInterventions: optimalInterventions})
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