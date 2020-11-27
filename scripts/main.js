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
    var playerUsernameAnonymised = null;

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
    } 
    
}


/* Game states */


// Levels
const levels = {
    1: {id: 1, max: 200},
    2: {id: 2, max: 200},
    3: {id: 3, max: 300},
    4: {id: 4, max: 400},
    5: {id: 5, max: 500},
    6: {id: 6, max: 700},
    7: {id: 7, max: 900},
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

            // Create game menu bar
            createMenu(); // menu.js
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

            // Continue to game
            return  incrementGamestate();

        },
        //leagueName: 'Tutorial',
            //leagueProgressMax: 2.8,
            //leagueMaxInterventions: 1,
    },
    3 : {
        name: 'game',
        action:  function(){

            // Configure view           
            setMiranaSettings('game'); 

            // Change skybox
            setBG();

            // Initialise model, view, and controller
            initialise(
                profile='game',
                pval=1, 
                maxInterventions=1, 
                data=jsonData);

            // On first load
            if(firstLoad){

                // Show tutorial
                tutorial('game');
                addButtonPressSound();

                // Ensure player has username
                if(playerUsername == null || playerUsername == undefined){playerUsername = 'Player'};
                if(playerUsernameAnonymised == null || playerUsernameAnonymised == undefined){playerUsernameAnonymised = `game-${Math.random()}`};
                
                firstLoad = false; // Disable game effects on first load
            }
            // If end game

            if(playerLvl>5){
                endGame();
            }

        },
        leagueName: 'Persephone',
            leagueProgressMax: 25,
            leagueMaxInterventions: 1,
    },
    4 : {
        name: 'endScreen',
        action:  function(){
            alert('Error #104. Please reload this page and make sure you are not clicking through too quickly!')
        },
    },
    iv : {
        name: 'interactiveVisualisation',
        action:  function(){

            // On first load
            if(firstLoad){

                // Show tutorial
                tutorial(gameState);
                addButtonPressSound();
                firstLoad = false; // Disable game effects on first load

                // Give user username
                if(playerUsernameAnonymised == null || playerUsernameAnonymised == undefined){playerUsernameAnonymised = `iv-${Math.random()}`};
                if(playerUsername == null || playerUsername == undefined){playerUsername = playerUsernameAnonymised};

            } else {
                $('#tutorial-iv-goals').show().css('opacity', 1);
            }

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
    function loadGame(playerData){

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
    stopSpaceTraffic = true;

    // Reset nodes after animations finish
    setTimeout(function(){

        // Reset styles
        setNodeOpacity(1);
        setEdgeOpacity(1);
        for(const [id, node] of Object.entries(gameData.nodes)){
            formatNode(node);
        }
    }, 2750);

    // Reset game
    gamestates[gameState].action();
}

/* Events on user interaction */


// Effect of players enacting an intervention
function playerMadeIntervention(nodeId){
    
    // Increment player intervention count
    playerInterventionCount ++;

    // Check triggers
    //if(firstLoad){createSpaceTraffic(1, 500, true); firstLoad = false; stopSpaceTraffic = true;} // If first load
    if(playerLvl>5){ endGame(); } // If end game
    if(gameState == 'iv'){return playerInteractedWithIV(nodeId)}; // If IV

    // Apply intervention strength unlock (now so it does not affect scoring by error)
    if(playerSelectedStrUpgrade){
        console.log(`upgrading str from ${playerInterventionStrength} to ${playerSelectedStrUpgrade.value}`)
        playerInterventionStrength=playerSelectedStrUpgrade.value;
        playerSelectedStrUpgrade = null;
    };

    // Clear player unlock state
    playerUnlocksSelected = null;

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

    // Policy ready sound
    policyReadySound.play();

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

        // Save player policy to DB
        let player_username = playerUsernameAnonymised;
        let intervention_targets = `${playerInterventionHistory}`;
        let policy_objective = gameData.objective.id;
            let policy_score = score.scores.efficiency;
            let policy_interventionCount = playerInterventionCount;
        recordMove(player_username, intervention_targets, policy_objective, policy_score, policy_interventionCount);

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

    // Show new level to player

        // Play level up sound
        lvlUpSound.play();

        // Advance progress bar
        setProgress('progress-goal-div', levels[playerLvl].max); // Progress bar    

        // Style progress bar
        styleProgressBar('lvl-up', playerLvl); // view.js

        // Enable progress bar press
        $('#progress-goal-div').one('click', function(){
            
            // Increment player level
            playerLvl++;
            if(playerLvl>5){
                endGame();
            }

            // Set unlocks to enabled

                // If not at max
                for(const unlock of [{id: 'max', value: playerInterventionMax}, {id: 'mult', value: playerInterventionStrength}]){
                    if(unlock.value == 4 || unlock.value == 2.5){continue};
                    // Value
                    const value = unlock.id=='max' ? Number(unlock.value)+1 : (Number(unlock.value)+0.5)*2;

                    console.log(unlock, value)
                    $(`#ul-${unlock.id}-${value}`).css('cursor', 'pointer');
                    $(`#ul-${unlock.id}-${value}-rd`).prop('disabled', false);
                    $(`#ul-${unlock.id}-${value}-i`).addClass("unlock-active")
                    $(`#ul-${unlock.id}-${value}-i`).addClass("unlock-active-animation")
                        // Animate
                        let counter = 0;
                        setInterval(function(){
                            counter++; if(counter > 10){return}
                            $(`#ul-${unlock.id}-${value}-i`).toggleClass("unlock-active-animation");
                        }, 1000);
                }
        
            // Reset player exp
            playerExp = 0;
            
            // Set level on progress bar
            setHTML('GUI-currentPlanet' , `Level ${playerLvl}`); // Text

            // Show level-up modal
            $('#modal-lvlup').modal('show');

        })

        // If player also triggered playerReachedInterventionMax, run this next
        $('#modal-lvlup').one('hidden.bs.modal', function (intervention) {
            
            if(playerLvl>5){
                endGame();
            }

            playerReachedInterventionMax(intervention);
        })
}

// Effect on player making unlocks
function playerUnlockedAbility(interventionMax, interventionStrength){

    // Record updates 
    const playerSelectedMaxUpgrade = interventionMax !== playerInterventionMax;
    const playerSelectedMultUpgrade = interventionStrength !== playerInterventionStrength;
        if(interventionStrength !== playerInterventionStrength){
            playerSelectedStrUpgrade = {id: 'playerSelectedStrUpgrade', value: interventionStrength};
        } 

    // Update game variables
    playerInterventionMax = interventionMax;

    // Disable radios
        const radios = [
            'ul-max-1',
            'ul-max-2',
            'ul-max-3',
            'ul-max-4',
            'ul-mult-2',
            'ul-mult-3',
            'ul-mult-4',
            'ul-mult-5',
        ];

        for(const radio of radios){
            $(`#${radio}`).css('cursor', 'default');
            $(`#${radio}-rd`).prop('disabled', true);
            $(`#${radio}-i`).removeClass("unlock-active");
            $(`#${radio}-i`).removeClass("unlock-active-animation");
        }

        // If end game
        if(playerLvl>5){
            endGame();
        }

}

// For IV
function playerInteractedWithIV(nodeId){

    // Save player intervention to DB
    let player_username = playerUsernameAnonymised;
    let policy_target = nodeId;
    let policy_interventionCount = playerInterventionCount;
    recordMove(player_username, policy_target, 999, 999, policy_interventionCount);

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

var err_count = 0;
// Effect if player selects invalid target
function playerSelectedInvalidTarget(nodeId, reason){
    err_count++;

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
            message = `
                you have reached the maximum number of interventions you can make. <br><br>
                Enact your policy to continue by pressing the 'Enact Policy' in the top left of the screen! <br><br>
                You only need to click on a trait once to make an intervention, 
                you might be receiving this message if you double click!`;
            break;
        case 4: //'trait already intervened on'
            message = 'you have already intervened on this trait. Please select another trait to intervene on';
            break;
        case 'err':
            return;
    }

    const id = `err-${err_count}`;
    // Display message
    constructMessage({
        id: id,
        position: {
            type: 'auto',
            element: null,
            x: null,
            y: null,
        },
        trigger: 'startup',
        reveal: null,
        gameStateSpecific: null,
        title: `Oops!`, 
        body: `
            You can't intervene on ${node.label} because ${message}.
        `, 
        btnText: `Dismiss`,
    });
    $(`#${id}`).show().animate({opacity: 1}, 500);

    
    if(playerLvl>5){
        endGame();
    }
}

// End game
function endGame(){ console.log('end game')
    $('#endgame-modal').modal('show');
    $(`#svg-main`).hide().animate({opacity: 0}, 500);
}