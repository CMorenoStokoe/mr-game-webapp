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
var gameState = 2; // State of the game
var currentSystemProgress = 0; // Player's progress in the current system league
var playerUsername = null; // Player's username
var playerInterventionCount = 0; // Number of interventions made by player, on 3 becomes a policy ad triggers an event
var playerInterventionMax = 1; // Maximum number of interventions the player can make per policy

// Developer controls for disabling preloading and loading game state directly for testing
window.onload = function(){
    
    // Option to skip preloading and intro
    var skipPreloadingAndIntro = true;
    if(skipPreloadingAndIntro){ 
        document.getElementById('loading-screen').style.display='none'; // Skip loading screen
        gamestates[gameState].action(); // Start game        
    } 
    // Otherwise load game normally
    else {preload();} // Preload assets and prepare splash
    
    // Add sounds to all button presses
    addButtonPressSound()
}
//window.onload = function(){gamestates[gameState].action()};

// Data for the different gamestates in the game
const gamestates = { // Different gamestates within the game (player levelling system)
    0 : {
        name: 'splash',
        action: function(){
            // Show splash login screen
            splash();
            initialiseLogin();
        },
    },
    1 : {
        name: 'intro',
        action: function(){
            
            // Remove login screen
            dismissSplash();

            // Play intro (no intro currently)
            //playIntro();

            // Play soundtrack
            playSoundtrack();

            // Continue to tutorial
            setTimeout(function(){
                incrementGamestate()
            }, 2000)
        },
    },
    2 : {
        name: 'tutorial',
        action: function(){
            
            // Start tutorial
            initialiseTutorial();

            // Change skybox
            document.body.style.background = `url("images/spaceboxes/3.jpg")`;
            document.body.style.backgroundSize = `cover`;

            // Init game
            initialise(pval=1, maxInterventions=1, data=tutorialData, tutorial=true);

            // Set planet name
            setText('GUI-currentPlanet', `Aeries-IV`);
        },
        leagueName: 'Tutorial',
            leagueProgressMax: 2.8,
            leagueMaxInterventions: 1,
    },
    3 : {
        name: 'game-lvl1',
        action:  function(){

            // Change skybox
            document.body.style.background = `url("images/spaceboxes/5.jpg")`;
            document.body.style.backgroundSize = `cover`;
            
            // Init game
            initialise(pval=5e-25, maxInterventions=1, data=jsonData);

        },
        leagueName: 'Aeries',
            leagueProgressMax: 10,
            leagueMaxInterventions: 1,
    },
    4 : {
        name: 'game-lvl2',
        action:  function(){

            // Change skybox
            document.body.style.background = `url("images/spaceboxes/6.jpg")`;
            document.body.style.backgroundSize = `cover`;
            
            // Init game
            initialise(pval=5e-17, maxInterventions=1, data=jsonData);

        },
        leagueName: 'Persephone',
            leagueProgressMax: 20,
            leagueMaxInterventions: 1,
    },
    5 : {
        name: 'game-lvl3',
        action:  function(){

            // Change skybox
            document.body.style.background = `url("images/spaceboxes/7.jpg")`;
            document.body.style.backgroundSize = `cover`;
            
            // Init game
            initialise(pval=2.77e-5, maxInterventions=1, data=jsonData);

        },
        leagueName: 'Eldred',
            leagueProgressMax: 30,
            leagueMaxInterventions: 1,
    },
    6 : {
        name: 'game-lvl4',
        action:  function(){

            // Redirect to feedback (adapted from: https://stackoverflow.com/questions/16973240/link-in-alert-boxes-javascript)
            if (window.confirm(' You win! Thank you for playing this gameplay slice, please give us your thoughts (click ok to be redirected)!')){
                window.location.href='https://bristolexppsych.eu.qualtrics.com/jfe/form/SV_3QWmGYxIG6WLHmd';
            };
        },
    },
}

// Function to initialise the game data, view and controllers
function initialise(pval, maxInterventions, data, tutorial=false){

    // Initialise gameData

        // Set game data to given dataset and filter by given pvalue
        gameData = initialiseData(data.nodes, data.links, pval);
    
    // Initialise gameplay    
    
        // Set value by which an intervention changes a trait
        //gameData.interventionStrength = 0.05; 
            
        // Choose an objective target
        gameData.setObjective();
            if(tutorial){gameData.setObjective('ukb_b_5238');}

    // Initialise GUI

        // Network visualisation
        initialiseView(gameData, pval, gamestates[gameState], currentSystemProgress); 
        
        // Set node sizes
        setNodeSizes(gameData);

    // Initialise controls

        // Set limit on number of interventions a player can combine into a policy
        playerInterventionMax = maxInterventions;

        // Create ability for players to click on nodes in visualisation
        initialiseControls(gameData); 
    
}

// Function to load player data
function loadPlayerData(username){
    
    // Get player data from server
    getPlayerData(username, loadGame);

    // Write this data to local variables and launch game
    function loadGame(playerData){ console.log(`Loaded player gamestate (${playerData})`)

        // Write data to local gamedata variables
        gameState = playerData.currentLevel;
        currentSystemProgress = playerData.currentProgress;
        playerUsername = playerData.username;
        
        // Start up the game at the player's level
        if(gameState == 0){
            incrementGamestate();
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
    console.log(currentSystemProgress)
    currentSystemProgress = 0;
    console.log(currentSystemProgress)
    gamestates[gameState].action();

    // Update online database
    updateProgress(playerUsername, gameState, currentSystemProgress);
        console.log('updating:', playerUsername, gameState, currentSystemProgress)

    console.log(currentSystemProgress)
}

// Function to update game displays
function updateTick(){
    
    // Update the GUI progress
    setNodeSizes(gameData);

}

// Function to configure what happens when players enact an intervention
function playerMadeIntervention(nodeId, direction){

    // Make intervention
        // Set intervention value
        var interventionValue = gameData.nodes[nodeId].prevalenceIncrease;
            if(direction == 'Decrease'){interventionValue *= -1;};
        
        // Run propagation using gameData Graph object, this node's ID, and increase
        const propagation = runPropagation(gameData, nodeId,  interventionValue);

    // View intervention effects
    
        // Highlight paths in intervention
        highlightEdges(propagation.path.edges); 

        // Show effects in list in GUI
        showPolicyEffects(propagation.result); 

        // Update display
        updateTick();
    
    // Score policy
        // Score intervention
        const intervention = scoreInterventionSuccess(gameData);
        
        // Show score and progress
        showScoreScreen(gameData, intervention); // Show win score screen
        currentSystemProgress += intervention.scores.total;  // Update system progress
        console.log(`Intervention scored and added to current sys progress ${currentSystemProgress}: `, intervention)

        // If the player has scored high enough to complete the system
        if(currentSystemProgress >= gamestates[gameState].leagueProgressMax){

            // Allow player to advance to next system
            $('#policyEffects-button').one('click', function(){
                incrementGamestate();
            })

        } else { // Else if the player has not scored high enough to complete the system

            // Allow the player to continue in a new planet within the system
            $('#policyEffects-button').one('click', function(){
                gamestates[gameState].action();
            })
        }

    // Reset intervention count
    playerInterventionCount = 0;
}
