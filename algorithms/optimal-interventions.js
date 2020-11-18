/*

Calculate optimal intervention
==============================
Description:
This script calculates the optimal intervention to achieve a goal.
Main script orders calculations from secondary calculation functions.

Use:
The main script calls this to calculate optimal interventions.

*/


/* Main */

// Create EvE algorithm data object
function createEvE(){

    // Return data class object
    return new EvEData();

}

// Initialise algorithm
function initialiseEvE(gameData){
    
    // Calculate the effects of all possible interventions
    return propagateEvE(gameData);

}

// Calculate optimal intervention
function calcOptimalIntervention(objectiveId, nodes, maxInterventions, EvE){ // EvE = results from all possible interventions
    var topInterventions = [];

    // Run calculation
    calculate(); 
    return topInterventions;

    // Begin series of intervention calculations (using callbacks to  prevent pileup errors)
    function calculate(){ 

        // Identify most effective intervention
        const optimalIntervention = identifyOptimalIntervention(objectiveId, nodes, EvE, topInterventions);
            if(optimalIntervention.id == null){return}

        // Add to list of results
        topInterventions.push(optimalIntervention)

        // Increment count and callback if not yet complete
        maxInterventions --;
        if(maxInterventions > 0){calculate()}
    }    
}


/* Calculations */


// Identify most effective intervention(s) to most beneficially affect objective trait
function identifyOptimalIntervention(objectiveId, nodes, EvE, topInterventions){
    var optimalIntervention = {id: null, objectiveEffect: 0};
    
    // Get most effective interventions
    for(const [id, effects] of Object.entries(EvE)){
        
        // Exclusion criteria
        var skip = false;

            // Is the objective
            if(id == objectiveId){skip = true;}

            // Is already in the list
            for(const intervention of topInterventions){ if (id == intervention.id){ skip = true }; };

        if(skip){continue;}

        // Extract results and path for intervention
        const results = effects.results;
        const path = effects.path;
        const objective = nodes[objectiveId];

        // Determine effect on objective

            // Get effects on objective
            const bestEffect = optimalIntervention.objectiveEffect;
            const thisEffect = results[objectiveId];

            // Determine if best intervention
            if(interventionIsBetter(objective, thisEffect, bestEffect)){
                optimalIntervention = {id: id, objectiveEffect: thisEffect};
            }
    }    

    return optimalIntervention;
}

// Calculate intervention effectiveness
function interventionIsBetter(objective, effect1, effect2){
    if(effect1 == undefined){return false}; // Ignore interventions with no effect on objective

    // Compare beneficial effects on objective
    if(objective.isGood){
        return effect1 > effect2; // Compare intervention effects
    }
    else { 
        return effect1 < effect2;
    }
}
