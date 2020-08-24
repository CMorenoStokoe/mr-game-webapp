/*
Main script
---------------

Intended purpose of this script:
- Build the graphical user interface (GUI)
- Facilitate gameplay controls and amend gameData as required

Contents of this script:
- Initialisation
    Functions which only run once at the start to initialise the GUI and gameplay

- Interactive gameplay functions
    Functions which run multiple times, triggered on player interactions (e.g., enacting policies)

Encapsulation:
- This master file runs functions found in other script files containing 
collections of methods categorised by purpose.

*/

// Global game variables
var gameData = null; // Game variables and public health data
var leftPanel = null; // Important GUI window which displays information on nodes
var gameState = 1; // State of the game
var playerInterventionCount = 0; // Number of interventions made by player, on 3 becomes a policy ad triggers an event
const leagues = { // Different leagues within the game (player levelling system)
    1 : {
        name: 'bronze',
        pval: 0.00000000000000005,
    },
    2 : {
        name: 'silver',
        pval: 0.00000000000000005,
    },
    3 : {
        name: 'gold',
        pval: 0.00000000000000005,
    },
    4 : {
        name: 'platinum',
        pval: 2.770083102493075e-5,
    },
}

// Function to initialise the game data, view and controllers
function initialise(){

    // Initialise gameData

    gameData = setGameData();

    // Initialise GUI

    initialiseView(gameData, leagues[gameState].pval); // Network visualisation

    leftPanel = new Panel('panel-left', 'left'); // node information GUI panel

    // Initialise controls

    initialiseControls(gameData, leftPanel); // Create ability for players to click on nodes in visualisation

}

// Function to set the game data by the player's current in-game progress 
function setGameData(){
    
    // Get pval threshold by player league level
    var pValueThreshold = leagues[gameState].pval;

    // Set game data using base game data and pval appropriate to player's level
    gameData = initialiseData(jsonData.nodes, jsonData.links, pValueThreshold);
    
    // Return gameData
    return(gameData)
}

// Function to update game displays
function updateTick(){

    
    // Update the GUI and progress
    updateView(gameData);

}

// Function to configure what happens when a player enacts 3 interventions in a row to form a policy
function playerMadePolicy(){

    // Action on player enacting a policy ...
    alert('Policy enacted!')
    
    // Reset the game data so new policies can be made
    gameData = setGameData();

    // Reset the network visualisation
    clearFDG('#svg-main');
    initialiseView(gameData, leagues[gameState].pval);
    addOnclickEventsToNodes(gameData, leftPanel); // On click controller

    // Reset intervention count
    playerInterventionCount = 0;

    // Update game
    updateTick();
}

// On window load, initialise
window.onload = initialise();