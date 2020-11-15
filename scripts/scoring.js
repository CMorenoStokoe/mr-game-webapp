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
function scoreIntervention(data, method='game'){

    // Score intervention results by data type and method
    switch(method){

        case 'game':
            return scoringMethod_game(data);
        
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
    objectiveScore = boundToRange(objectiveScore);
    goodnessScore = boundToRange(goodnessScore / 4);
    timeScore = boundToRange(timeScore);
    awardScore = boundToRange(awardScore);
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
}