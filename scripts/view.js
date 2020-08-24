/*

View
====
Description: 
This file contains the scripts to produce the view for the game.

Use: 
This file is called by the main script and calls other functions in other secondary files.

*/

function initialiseView(gameData, pValueThreshold){
    // Set SVG height to fill window container
    svgContainerHeight = document.getElementById('svg-container').offsetHeight;
        document.getElementById('svg-main').setAttribute('height', svgContainerHeight);
    svgContainerWidth = document.getElementById('svg-container').offsetWidth;
        document.getElementById('svg-main').setAttribute('width', svgContainerWidth);

    // Initialise graph with pval = bonferroni, settings = mirana + settings.js modifications
    generateGraphFromJSON(gameData.toD3().nodes, gameData.toD3().links, '#svg-main', settings, pValueThreshold); 

    // Ensure objective is correctly set
    setText('goal', `Raise ${gameData.objective.label}`);

    // Set progress towards goal
    setProgress('progress-goal', gameData.objective.prevalence, {min: gameData.objective.min, max: gameData.objective.max});
    
    // Have helper text on initialisation prompting the player to make an intervention
    setText('progress-helpText', `Enact policies to make progress.`);
    
}

function updateView(gameData){
console.log(gameData.objective)
    // Ensure objective is correctly set
    setText('goal', `Raise ${gameData.objective.label}`);

    // Update progress towards goal
    setProgress('progress-goal', gameData.objective.prevalence, {min: gameData.objective.min, max: gameData.objective.max});

    // Remove helper text under policies
    setText('progress-helpText', ``);
}