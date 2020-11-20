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
    var playerInterventionStrength = 1; // Modifier for intervention strength
    var playerSelectedStrUpgrade = null;

    // Player level
    var playerExp = 0; // Player experience points
    var playerLvl = 1; // Player level

    // User interface
    var skipAnimations = false;
    var firstLoad = true;


/* Start-up configuration */


// Loading settings
window.onload = function(){

    // Developer mode 
    if(developerMode){ // Automatically start-up in specific mode for testing
        
        // Specify game state to load immediately
        gameState = developerMode;

        // Dismiss loading screen and load specified game state immediately
        document.getElementById('loading-screen').style.display='none'; 
        gamestates[gameState].action(); 
    
    }
    // Preview mode
    else if(previewMode){ // GUI to select mode to start-up for demonstration
        
        // Dismiss loading screen and show preview console
        document.getElementById('loading-screen').style.display='none'; 
        $('#dev-modal').modal('show');
        
            // Give users buttons to choose game state to preview
            $('#dev-btn-3').click(function(){gameState='iv'});
            $('#dev-btn-4').click(function(){gameState=3});

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


// Levels
const levels = {
    1: {id: 1, max: 100},
    2: {id: 2, max: 200},
    3: {id: 3, max: 300},
    4: {id: 4, max: 400},
    5: {id: 5, max: 500},
    6: {id: 'End of game', max:1},
}

// Data for the different gamestates in the game
const gamestates = { // Different gamestates within the game (player levelling system)
    0 : {
        name: 'splash',
        action: function(){

            // Set BG for splash
            setBG(5);

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

                // Continue
                incrementGamestate();
            }, 2000)

        },
    },
    2 : {
        name: 'tutorial',
        action: function(){

            $('#tutorial-0-modal').modal('show'); // Auto-show initial intro modal 
            return  incrementGamestate();

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
            document.body.style.background = `url("images/spaceboxes/${getRandomInt(8)}.jpg")`;
            document.body.style.backgroundSize = `cover`;
        },
        leagueName: 'Tutorial',
            leagueProgressMax: 2.8,
            leagueMaxInterventions: 1,
    },
    3 : {
        name: 'game',
        action:  function(){

            // Configure view            
            $('#legend_key').show();
            setMiranaSettings('game'); 

            // Change skybox
            setBG();
            //document.body.style.background = `url("images/spaceboxes/${getRandomInt(8)}.jpg") no-repeat center center fixed`;

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
    4 : {
        name: 'endScreen',
        action:  function(){
            alert('You win! Thank you for playing this mini-game!')
        },
    },
    iv : {
        name: 'interactiveVisualisation',
        action:  function(){

            // Disable game effects on first load
            firstLoad = false;

            // Auto-show initial intro modal 
            $('#tutorial-0-modal').modal('show');

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
        initialiseView(
            profile, 
            gameData,
            pval, 
            gamestates[gameState], 
            playerExp,
            levels,
            playerLvl,
        ); 
        
        // Set node sizes
        //formatNodes(gameData);

    // Initialise controls
        
        // Allow users to make interventions (if enabled)
        if(maxInterventions>0){
            
            // Set limit on number of interventions a player can combine into a policy
            //playerInterventionMax = maxInterventions;

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
    // Interrupt animations
    skipAnimations = true;
    setTimeout(function(){
        setNodeOpacity(1);
        setEdgeOpacity(1);
    }, 2500);

    // Reset game
    gamestates[gameState].action();
}

/* Events on user interaction */


// Effect of players enacting an intervention
function playerMadeIntervention(nodeId){
    if(firstLoad){createSpaceTraffic(1, 500, true); firstLoad = false; stopSpaceTraffic = true;} // Space traffic
    
    // Treat IV users differently
    if(gameState == 'iv'){return playerInteractedWithIV(nodeId)};

    // Apply intervention strength unlock (now so it does not affect scoring by error)
    if(playerSelectedStrUpgrade){
        console.log(`upgrading str from ${playerInterventionStrength} to ${playerSelectedStrUpgrade.value}`)
        playerInterventionStrength=playerSelectedStrUpgrade.value;
        playerSelectedStrUpgrade = null;
    };

    // Clear player unlock state
    playerUnlocksSelected = null;

    // Increment player intervention count
    playerInterventionCount ++;

    // Make intervention

        // Get intervention value
        var interventionValue = gameData.nodes[nodeId].prevalenceIncrease;
        
            // Only allow good effects
            if(!(gameData.nodes[nodeId].isGood)){interventionValue *= -1};

            // Modify by player unlockable intervention strength modifier
            interventionValue *= playerInterventionStrength;
        
        // Make intervention
        const propagation = runPropagation(gameData, nodeId,  interventionValue);

        // Log intervention
        playerInterventionHistory.unshift(nodeId);

    // Calculate intervention effects
    
        // Score
        var intervention = scoreIntervention(gameData, method='game', interventionEffects = propagation.result, 1);
            console.log('Intervention scored', intervention)
            console.log(`Intervention efficiency: ${intervention.scores.efficiency}`, intervention.efficiency)    
            if(gameState == 'vis'){ intervention  = scoreIntervention(gameData, method='test'); conveyVisResults(); }; // Score differently if in vis; conveyVisResults is in view.js}

        // Exp
        //const exp = calculateExp(node, effect=propagation.result[node.id], efficiency); // scoring.js
        if(Number.isNaN(intervention.scores.efficiency)){
            console.log('NAN issue', nodeId, gameData.objective.id, propagation, intervention)
        } else {
            playerExp += intervention.scores.efficiency;
        }

        // Level
        const lvl = calculateLevel(playerExp, levels);

    // Show intervention effects

        // Enable animations
        skipAnimations = false;

        // Propagation
        animatePropagation(propagation.path.edges, dataCallback); //animation2();
            function dataCallback(node){return} //efficiency = {score: intervention.scores.efficiency, efficiency: intervention.efficiency}
            //dataCallback(gameData.nodes[nodeId], propagation.result[gameData.nodes[nodeId].id]); // Intervention origin  

        // Exp
        showExpFx(playerExp, levels[playerLvl].max, intervention.scores.efficiency);
        //showPolicyEffects(propagation.result); // Show effects in list in GUI
        
    // Check for triggers

        // Level-up
        if(lvl > playerLvl){ 
            playerLevelledUp(intervention);
        }

        // Intervention max reached
        else if(playerInterventionCount >= playerInterventionMax){
            playerReachedInterventionMax(intervention)
        };
}

// Effects of player enacting interventions up to their maximum allowance of concurrent interventions
function playerReachedInterventionMax(intervention){

    // Format progress bar
    styleProgressBar('intervention-max'); // view.js

    // Enable continue button action
    $('#progress-goal-div').one('click', function(intervention){

        // Get total intervention effects of all interventions
        const totalInterventionEffects = {};
        for(const [key, value] of Object.entries(gameData.nodes)){
            totalInterventionEffects[key] = value.change_unlimited;
        }

        // Show intervention effects
        const score = scoreIntervention(gameData, method='game', totalInterventionEffects, playerInterventionCount);
            showScoreScreen(gameData, score, playerInterventionHistory);
            console.log('Policy scored', score)

        // Reset player intervention count
        playerInterventionCount = 0;

        // Reset player intervention history
        playerInterventionHistory = [];

        // Fade out now to fade in to hide force directed graph jiggling on creation
        $('#svg-main').animate({opacity: 0}, 500); 

        // Reset game
        // If player also triggered playerReachedInterventionMax, run this next
        $('#win-screen-btn').one('click', function() {
            
            // Reset simulation
            reset();
        })

    })
}

// Event on player level up
function playerLevelledUp(intervention){

    // Raise player level

    // Show new level to player

        // Advance progress bar
        setProgress('progress-goal-div', levels[playerLvl].max); // Progress bar    

        // Style progress bar
        styleProgressBar('lvl-up', playerLvl); // view.js

        // Enable progress bar press
        $('#progress-goal-div').one('click', function(intervention){
            
            // Increment player level
            playerLvl++;
    
            // If end of game
            if(playerLvl>5){
                alert('You win! Thank you for playing.')
            }
        
            // Reset player exp
            playerExp = 0;
            
            // Set level on progress bar
            setHTML('GUI-currentPlanet' , `Level ${playerLvl}`); // Text

            // Set unlocks to enabled
            $("#unlocks :input").prop('disabled', false);
            $("#unlocks .unlock").css('cursor', 'pointer');
            $("#unlocks").css('filter', '');

            // Show level-up modal
            $('#modal-lvlup').modal('show');

        })

        // If player also triggered playerReachedInterventionMax, run this next
        $('#modal-lvlup').one('hidden.bs.modal', function (intervention) {
            playerReachedInterventionMax(intervention);
        })
}

// Effect on player making unlocks
function playerUnlockedAbility(interventionMax, interventionStrength){

    // Record update 
    if(interventionStrength !== playerInterventionStrength){
        playerSelectedStrUpgrade = {id: 'playerSelectedStrUpgrade', value: interventionStrength};
    } 
    console.log('player unlocked', interventionMax, interventionStrength, 'from', playerInterventionStrength, playerInterventionMax, );

    // Update game variables
    playerInterventionMax = interventionMax;

    // Disable options again until level up
    $("#unlocks :input").prop('disabled', true);
    $("#unlocks .unlock").css('cursor', 'default');
    $("#unlocks").css('filter', 'grayscale(100%)');
}

// For IV
function playerInteractedWithIV(nodeId){

    // Make intervention

        // Get intervention value
        var interventionValue = gameData.nodes[nodeId].prevalenceIncrease;
        
            // Only allow good effects
            if(!(gameData.nodes[nodeId].isGood)){interventionValue *= -1};

            // Modify by player unlockable intervention strength modifier
            interventionValue *= playerInterventionStrength;
        
        // Make intervention
        const propagation = runPropagation(gameData, nodeId,  interventionValue);

    // Show intervention effects

        // Propagation
        skipAnimations = false; // Enable animations
        animatePropagation(propagation.path.edges, dataCallback); //animation2();
            function dataCallback(node){return} //efficiency = {score: intervention.scores.efficiency, efficiency: intervention.efficiency}
            //dataCallback(gameData.nodes[nodeId], propagation.result[gameData.nodes[nodeId].id]); // Intervention origin  
}

// Effect if player selects invalid target
function playerSelectedInvalidTarget(nodeId, reason){

    // Get node
    const node = gameData.nodes[nodeId];

    // Assemble message
    var message = 'Error processing intervention (code #3). Please try making another intervention.';
    
    switch(reason){
        case 1: //'node is objective' 
            message = 'the trait you selected is the objective. Please select another trait to intervene on';
            break;
        case 2: //'node has no outgoing effects'
            message = 'the trait you selected would have no effects if it was intervened on. Please select another trait to intervene on';
            break;
        case 3: //'intervention max reached'
            message = 'you have reached the maximum number of interventions you can make. Please continue with the game';
            break;
        case 4: //'trait already intervened on'
            message = 'you have already intervened on this trait. Please select another trait to intervene on';
            break;
        case 'err':
            return;
    }

    // Display message
    alert(`
        Invalid target

        You can't intervene on ${node.label} because ${message}.
    `)
}
