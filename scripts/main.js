/*

Main script
===========

Intended purpose of this script:
- Build the graphical user interface (GUI)
- Facilitate gameplay controls and amend gameData as required

Contents
--------
- Game variables ('Global game variables')
    Variables used to set important game settings

- Start-up modes
    Load the game in developer or normal mode

- Gamestates
    Settings for loading the game variations with specific MCV components

- Initialisation ('Initialise MCV')
    Functions which only run once at the start to initialise the GUI and gameplay

- Game state and game data functions ('Alter game state')
    Functions which are used to alter the game state and player data after or before initialisation

- Interactive gameplay functions ('Events on user interaction')
    Functions which run multiple times, triggered on player interactions (e.g., enacting policies)


Encapsulation:
- This master file runs functions found in other script files containing 
collections of methods categorised by purpose.

*/


/*  Global game variables */


// Game and player variables

    // Game data
    var gameData = null; // Game variables and public health data
    var gameState = 0; // State of the game
    const EvE = createEvE(); // Results of all possible interventions

    // Player information
    var currentSystemProgress = 0; // Player's progress in the current system league
    var playerUsername = null; // Player's username

    // Player actions
    var playerInterventionCount = 0; // Number of interventions made by player, on 3 becomes a policy ad triggers an event
    var playerInterventionMax = 1; // Maximum number of interventions the player can make per policy
    var playerInterventionHistory = [];

    // Player level
    var playerExp = 0; // Player experience points

    // User interface
    var skipAnimations = false;


/* Start-up configuration */


// Loading settings
window.onload = function(){
    developerMode = true;
    previewMode = true;

    // Developer mode 
    if(developerMode){ // Automatically start-up in specific mode for testing
        
        // Specify game state to load immediately
        gameState = 3;

        // Dismiss loading screen and load specified game state immediately
        document.getElementById('loading-screen').style.display='none'; 
        gamestates[gameState].action(); 
    
    }

    // Preview mode
    else if(previewMode){ // GUI to select mode to start-up for demonstration
        
        // Dismiss loading screen and show preview console
        document.getElementById('loading-screen').style.display='none'; 
        $('#dev-modal').modal('show')
        
            // Give users buttons to choose game state to preview
            $('#dev-btn-3').click(function(){gameState='iv'})
            $('#dev-btn-4').click(function(){gameState=3})
            $('#dev-btn-5').click(function(){gameState='vis'})
            $('#dev-btn-6').click(function(){gameState='vis2'})

            // On dismiss load the chosen game state
            $('#dev-modal').on('hidden.bs.modal', function(){gamestates[gameState].action();})    
    } 

    // Otherwise load game normally
    else {
        preload(); // Preload assets and prepare splash
        addButtonPressSound(); // Add sounds to button presses
    } 
    
}


/* Game states */


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
                objective='ukb_b_5238');

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

            gameData.setObjective("ukb_b_4956")

        },
        leagueName: 'Persephone',
            leagueProgressMax: 25,
            leagueMaxInterventions: 1,
    },
    4 : {
        name: 'endScreen',
        action:  function(){

            // Redirect to feedback (adapted from: https://stackoverflow.com/questions/16973240/link-in-alert-boxes-javascript)
            if (window.confirm(' You win! Thank you for playing this gameplay slice, please give us your thoughts (click ok to be redirected)!')){
                window.location.href='https://bristolexppsych.eu.qualtrics.com/jfe/form/SV_3QWmGYxIG6WLHmd';
            };
        },
    },
    iv : {
        name: 'interactiveVisualisation',
        action:  function(){

            // Configure view
            setMiranaSettings('interactiveVisualisation'); 
            
            // Initialise model, view, and controller
            initialise(
                profile='interactiveVisualisation',
                pval=1,
                maxInterventions=1, 
                data=jsonData,
                objective = 'none');
            hideGameUI(); // Hide game UI
            showInteractiveVisUI(); // Show interactive vis UI
            interactiveVisualisationControls(); // Controls for interactive vis
            hideAllLabels(gameData.nodes);
            
        },
        leagueName: 'interactive visualisation',
            leagueProgressMax: 999,
            leagueMaxInterventions: 3,
    },
    vis : {
        name: 'visualisation for test',
        action:  function(){

            // Configure view
            setMiranaSettings('test'); 

            // Initialise model, view, and controller
            initialise(
                profile='visualisation', 
                pval=1, 
                maxInterventions=0, 
                data=jsonData,
                objective = 'none');
            hideGameUI(); // Remove game UI
            showTestUI(); // Add test UI
            initialiseTestControls(); // Controls for test

        },
        leagueName: 'visualisation',
            leagueProgressMax: 999,
            leagueMaxInterventions: 3,
    },
    vis2 : {
        name: 'visualisation of data',
        action:  function(){

            // Configure view
            setMiranaSettings('visualisation'); 

            // Initialise model, view, and controller
            initialise(
                profile='visualisation',
                pval=1, 
                maxInterventions=0, 
                data=jsonData,
                objective = 'none');
            hideGameUI(); // Remove game UI

        },
        leagueName: 'visualisation',
            leagueProgressMax: 999,
            leagueMaxInterventions: 3,
    },
}


/* Initialise MCV */


// Function to initialise the game data, view and controllers
function initialise(profile, pval, maxInterventions, data, objective='random'){

    // Initialise gameData
    
        // Set game data to given dataset and filter by given pvalue
        gameData = initialiseData(data.nodes, data.links, pval);

        // Initialise EvE (if not already done)
        if(!(EvE.initialised)){EvE.init(gameData)} // Calculate results of every possible intervention 
        
    // Initialise gameplay    
    
        // Set value by which an intervention changes a trait
        //gameData.interventionStrength = 0.05; 
            
        // Choose an objective target
        switch(objective){
            case 'random':
                gameData.setObjective();
                break;
            case 'none':
                break;
            default:
                gameData.setObjective(objective);
                break;
        }
            

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


/* Change game state */


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

// Function to reset
function reset(){

    // Try to stop any current animations without impacting future animations
    skipAnimations = true; 
    setTimeout(function(){skipAnimations = false;}, 2000);

}


/* Events on user interaction */


// Effect of players enacting an intervention
function playerMadeIntervention(nodeId){

    // Increment player intervention count
    playerInterventionCount ++;

    // Make intervention

        // Get intervention value
        var interventionValue = gameData.nodes[nodeId].prevalenceIncrease;
            if(!(gameData.nodes[nodeId].isGood)){interventionValue *= -1};
        
        // Make intervention
        const propagation = runPropagation(gameData, nodeId,  interventionValue);

        // Log intervention
        playerInterventionHistory.unshift(propagation);

    // Intervention effects
    
        // Calculate score
            var intervention = scoreIntervention(gameData, method='game');
            if(intervention.efficiency){console.log(`${intervention.scores.efficiency}% effeciency (Best: ${gameData.nodes[intervention.efficiency.optimalInterventions[0].id].label} [${intervention.efficiency.optimalInterventions[0].objectiveEffect}])`)}
            else{'No possible intervention would have beneficial effects'}
            if(gameState == 'vis'){ intervention  = scoreIntervention(gameData, method='test'); conveyVisResults(); }; // Score differently if in vis; conveyVisResults is in view.js}

        // Update view
        animatePropagation(propagation.path.edges, dataCallback); //animation2();
            //showPolicyEffects(propagation.result); // Show effects in list in GUI

        // Update model
        function dataCallback(node){

            // Calculate exp
            const score = node.isGood ? propagation.result[node.id] : -propagation.result[node.id];
            
            playerExp += score;
                console.log(node, node.isGood, score, playerExp);
        }
        
        // Advance level if reached
        //if(playerExp > 0.1){alert('Level up! Level 2. Exp:', playerExp)}

    // Trigger event on player reaching intervention maximum (if triggered)
    if(playerInterventionCount >= playerInterventionMax){playerReachedInterventionMax()};
}

// Effects of player enacting interventions up to their maximum allowance of concurrent interventions
function playerReachedInterventionMax(){

    // Reset player intervention count
    playerInterventionCount = 0

    // Reset player intervention history
    playerInterventionHistory = [];

    // Reset game
    //reset();

}

// Effect if player selects invalid target
function playerSelectedInvalidTarget(nodeId, reason){

    // Get node
    const node = gameData.nodes[nodeId];

    // Assemble message
    var message = 'Error processing intervention (code #3). Please try making another intervention.';
    switch(reason){
        case 'node is objective': 
            message = 'the node you selected is the objective';
            break;
        case 'node has no outgoing effects': 
            message = 'the node you selected would have no effects if it was intervened on';
            break;
        case 'err':
            return;
    }

    // Display message
    alert(`
        Invalid target

        You can't intervene on ${node.label} because ${reason}. 
        
        Please select another trait to intervene on.
    `)
}