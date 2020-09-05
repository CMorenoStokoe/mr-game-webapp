/*

Tutorial
=====
Description: This file contains scripts for the tutorial for the game.

Use: This file is called by the main script when a player has logged in and is first starting the game.

*/

// Stage of tutorial
var tutorialStage = 0;

// Function to initialise tutorial elements
function initialiseTutorial(){
    console.log(tutorialStage)
}

// Function to advance the tutorial
function advanceTutorial(){

    // Advance tutorial stage
    tutorialStage ++;

    // Show the next stage of the tutorial
    intialiseTutorial(tutorialStage);
}