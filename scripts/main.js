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
var gameState = 5; // State of the game
var currentSystemProgress = 0; // Player's progress in the current system league
var playerUsername = null; // Player's username
var playerInterventionCount = 0; // Number of interventions made by player, on 3 becomes a policy ad triggers an event
var playerInterventionMax = 1; // Maximum number of interventions the player can make per policy

// Developer controls for disabling preloading and loading game state directly for testing
window.onload = function(){
    
    // Developer modes
    const developerMode = false;
    if(developerMode){
        gameState = 3;
        gamestates[gameState].action(); document.getElementById('loading-screen').style.display='none'; return;
    }
    var previewMode = true;
    if(previewMode){ 
        // Show dev console instead of loading screen
        document.getElementById('loading-screen').style.display='none'; 
        $('#dev-modal').modal('show')
        
        // Buttons to choose mode
        $('#dev-btn-3').click(function(){gameState=3})
        $('#dev-btn-5').click(function(){gameState=5})
        $('#dev-btn-6').click(function(){gameState=6})

        // Start game in chosen mode
        $('#dev-modal').on('hidden.bs.modal', function(){gamestates[gameState].action();})    
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

            // Play introduction
            playSoundtrack();
            //playIntro(); // Play intro (no intro currently)

            // Continue to tutorial
            setTimeout(function(){
                incrementGamestate()
            }, 2000)
        },
    },
    2 : {
        name: 'tutorial',
        action: function(){

            // Configure view
            setMiranaSettings('game'); 
            
            // Start tutorial
            initialiseTutorial();

            // Initialise model, view, and controller
            initialise(
                profile='game',
                pval=1, 
                maxInterventions=1, 
                data=tutorialData, 
                tutorial=true);

            // Set background
            document.body.style.background = `url("images/spaceboxes/3.jpg")`;
            document.body.style.backgroundSize = `cover`;
            setText('GUI-currentPlanet', `Aeries-IV`);
        },
        leagueName: 'Tutorial',
            leagueProgressMax: 2.8,
            leagueMaxInterventions: 1,
    },
    3 : {
        name: 'interactiveVisualisation',
        action:  function(){

            // Configure view
            setMiranaSettings('interactiveVisualisation'); 
            
            // Initialise model, view, and controller
            initialise(
                profile='interactiveVisualisation',
                pval=1,
                maxInterventions=1, 
                data=jsonData);
            hideGameUI(); // Hide game UI
            showInteractiveVisUI(); // Show interactive vis UI
            interactiveVisualisationControls(); // Controls for interactive vis

        },
        leagueName: 'interactive visualisation',
            leagueProgressMax: 999,
            leagueMaxInterventions: 3,
    },
    4 : {
        name: 'game',
        action:  function(){

            // Configure view
            setMiranaSettings('game'); 

            // Change skybox
            document.body.style.background = `url("images/spaceboxes/6.jpg")`;
            document.body.style.backgroundSize = `cover`;
            
            // Initialise model, view, and controller
            initialise(
                profile='game',
                pval=1, 
                maxInterventions=1, 
                data=jsonData);

        },
        leagueName: 'Persephone',
            leagueProgressMax: 25,
            leagueMaxInterventions: 1,
    },
    5 : {
        name: 'visualisation for test',
        action:  function(){

            // Configure view
            setMiranaSettings('test'); 

            // Initialise model, view, and controller
            initialise(
                profile='visualisation', 
                pval=1, 
                maxInterventions=0, 
                data=jsonData);
            hideGameUI(); // Remove game UI
            showTestUI(); // Add test UI
            initialiseTestControls(); // Controls for test

        },
        leagueName: 'visualisation',
            leagueProgressMax: 999,
            leagueMaxInterventions: 3,
    },
    6 : {
        name: 'visualisation of data',
        action:  function(){

            // Configure view
            setMiranaSettings('visualisation'); 

            // Initialise model, view, and controller
            initialise(
                profile='visualisation',
                pval=1, 
                maxInterventions=0, 
                data=jsonData);
            hideGameUI(); // Remove game UI

        },
        leagueName: 'visualisation',
            leagueProgressMax: 999,
            leagueMaxInterventions: 3,
    },
    7 : {
        name: 'endScreen',
        action:  function(){

            // Redirect to feedback (adapted from: https://stackoverflow.com/questions/16973240/link-in-alert-boxes-javascript)
            if (window.confirm(' You win! Thank you for playing this gameplay slice, please give us your thoughts (click ok to be redirected)!')){
                window.location.href='https://bristolexppsych.eu.qualtrics.com/jfe/form/SV_3QWmGYxIG6WLHmd';
            };
        },
    },
}

// Function to initialise the game data, view and controllers
function initialise(profile, pval, maxInterventions, data, tutorial=false){

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
        initialiseView(profile, gameData, pval, gamestates[gameState], currentSystemProgress); 
        
        // Set node sizes
        //formatNodes(gameData);

    // Initialise controls
        
        // Allow users to make interventions (if enabled)
        if(maxInterventions>0){
            
            // Set limit on number of interventions a player can combine into a policy
            playerInterventionMax = maxInterventions;

            // Create ability for players to click on nodes in visualisation
            initialiseControls(gameData); 

        }
    
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
    currentSystemProgress = 0;
    gamestates[gameState].action();

    // Update online database
    updateProgress(playerUsername, gameState, currentSystemProgress);
        console.log('updating:', playerUsername, gameState, currentSystemProgress)

}

// Function to update game displays
function updateTick(){
    
    // Update the GUI progress
    //formatNodes(gameData);

}

// Function to configure what happens when players enact an intervention
function playerMadeIntervention(nodeId, direction='Increase'){

    // Make intervention
        // Set intervention value
        var interventionValue = gameData.nodes[nodeId].prevalenceIncrease;
            if(!(gameData.nodes[nodeId].isGood)){interventionValue *= -1};
            if(direction == 'Decrease'){interventionValue *= -1;};
        
        // Run propagation using gameData Graph object, this node's ID, and increase
        const propagation = runPropagation(gameData, nodeId,  interventionValue);

    // View intervention effects
    
        // Highlight paths in intervention
        showInterventionEffects(propagation.path.edges); 

        // Show effects in list in GUI
        //showPolicyEffects(propagation.result); 

        // Update display
        //updateTick();
    
    /* Score policy
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
    */

    // Reset intervention count
    //playerInterventionCount = 0;
}

function userChoseAnswer(nodeId){
    
    // Highlight node
    highlightNode(nodeId);

    // Increment intervention count
    playerInterventionCount ++;

    // Once 3 choices made send answer
    if(playerInterventionCount >= 3){
        setTimeout(function(){
            alert('Test answers recorded. You scored: $SCORE')
            gamestates[gameState].action();
        }, 2000)
    }
}