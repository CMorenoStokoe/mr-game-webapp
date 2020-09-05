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
var gameState = 0; // State of the game
var currentSystemProgress = 0; // Player's progress in the current system league
var playerUsername = null; // Player's username
var playerInterventionCount = 0; // Number of interventions made by player, on 3 becomes a policy ad triggers an event
var playerInterventionMax = 1; // Maximum number of interventions the player can make per policy


// Data for the different gamestates in the game
const gamestates = { // Different gamestates within the game (player levelling system)
    0 : {
        name: 'splash',
        action: function(){
            splash();
            initialiseLogin();
        },
    },
    1 : {
        name: 'intro',
        action: function(){
            playIntro();
            incrementGamestate();
        },
    },
    2 : {
        name: 'tutorial',
        action: function(){
            initialise(pval=1, maxInterventions=1, data=jsonData);
            initialiseTutorial();
        },
        leagueName: 'Tutorial',
    },
    3 : {
        name: 'game-lvl1',
        action:  function(){
            initialise(pval=5e-17, maxInterventions=1, data=jsonData);
        },
        leagueName: 'Aeries',
    },
    4 : {
        name: 'game-lvl2',
        action:  function(){
            initialise(pval=2.77e-5, maxInterventions=2, data=jsonData);
        },
        leagueName: 'Persephone',
    },
    5 : {
        name: 'game-lvl3',
        action:  function(){
            initialise(pval=0.001, maxInterventions=3, data=jsonData);
        },
        leagueName: 'Eldred',
    },
    6 : {
        name: 'game-lvl4',
        action:  function(){
            initialise(pval=0.05, maxInterventions=4, data=jsonData);
        },
        leagueName: 'Zyzyx',
    },
}

// Function to initialise the game data, view and controllers
function initialise(pval, maxInterventions, data){
    console.log(pval, maxInterventions, data)

    // Initialise gameData

        // Set game data to given dataset and filter by given pvalue
        gameData = setGameData(pval, data.nodes, data.links);

    // Initialise GUI

        // Network visualisation
        initialiseView(gameData, pval, gamestates[gameState]); 

        // node information GUI panel
        leftPanel = new Panel('panel-left', 'left'); 
        
        // Set node sizes
        setNodeSizes(gameData);

    // Initialise controls

        // Set limit on number of interventions a player can combine into a policy
        playerInterventionMax = maxInterventions;

        // Create ability for players to click on nodes in visualisation
        initialiseControls(gameData, leftPanel); 
    
}

// Function to load player data
function loadPlayerData(username){
    
    // Get player data from server
    getPlayerData(username, loadGame)

    // Write this data to local variables and launch game
    function loadGame(playerData){ console.log(`Loaded player gamestate (${playerData})`)

        // Write data to local gamedata variables
        gameState = playerData.currentLevel;
        currentSystemProgress = playerData.currentProgress;
        playerUsername = playerData.username;
        
        // Start up the game at the player's level
        if(gameState == 0){
            incrementGamestate()
        } else {
            gamestates[gameState].action();
        }
    }

}


// Function to increment the game state
function incrementGamestate(){

    // Increment gamestate
    gameState ++;

    // Intialise game appropriate to new gamestate
    gamestates[gameState].action();

    // Update online database
    console.log('updating:', playerUsername, gameState, currentSystemProgress)
    updateProgress(playerUsername, gameState, currentSystemProgress);
}


// Function to set the game data by the player's current in-game progress 
function setGameData(pval, nodes, links){

    // Set game data using base game data and pval appropriate to player's level
    gameData = initialiseData(nodes, links, pval);
    
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

    // Update game
    updateTick();
    
    // Action on player enacting a policy ...
    alert(`Policy enacted! You changed ${gameData.objective.label} by ${to4SF(gameData.objective.change)}`)
    
    // Reset the game data and views
    clearFDG('#svg-main');
    gamestates[gameState].action;

    // Reset intervention count
    playerInterventionCount = 0;
}

// On window load, initialise
window.onload = gamestates[gameState].action;
