/*

Tutorial
=====
Description: This file contains scripts for the tutorial for the game.

Use: This file is called by the main script when a player has logged in and is first starting the game.

*/

// 
function tutorial(gameState){

    // Fired events
    var eventFired={};

    // Hide GUI elements for reveal
    $('#GUI-planetInfo').show().css('opacity', 1);
    $('#GUI-currentPlanet-div').hide().css('opacity', 0);
    $('#progress-goal-div-div').hide().css('opacity', 0);
    $('#GUI-goal').hide().css('opacity', 0);

    const dialogs = [
        // Everyone
        {
            id: 'tutorial-welcome',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'startup',
            reveal: null,
            gameStateSpecific: null,
            title: 'Public Health Simulation', 
            body: `
                <p class='text-left'>
                <strong>Our data</strong><br>
                The data we are about to present you was analysed from genomics datasets containing information on around a million participants’ genetics and life factors. 
                From this we have created a simulation of the population prevalence and effects of 17 health, wellbeing, mental health and behavioural traits. 
                We are using this data as the template for this study even though some effects might appear unrealistic.
                <br><br>
                <strong>Your role</strong><br>
                We are putting you in the position of public health policy maker for this population. 
                Your aim is to use public health interventions to minimise the prevalence of negative traits and maximise the prevalence of good traits.
                <br><br>
                <strong>Tutorial</strong><br>
                You will now be shown a short tutorial to help you make interventions using this software. 
                Please read the dialogues and press the yellow buttons when you are ready to continue.
                </p>
            `, 
        },
        {
            id: 'tutorial-controls',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: null,
            gameStateSpecific: null,
            title: 'Controls', 
            body: `
            <div class='d-flex flex-column justify-content-center'>    
            <img src='images/tutorial/controls.gif' class='m-2 d-flex align-self-center' style='height: 200px; width: auto;  border-radius: 5px;'>
                <br><br>
                <p><strong><i class="fas fa-mouse"></i> Click </strong> <br> On a trait to intervene on it </p>
                <p><strong><i class="fas fa-mouse-pointer"></i> Hover </strong><br> Over a trait to see its <strong>name</strong>, <strong>prevalence</strong> and <strong>effects</strong>
                <br><p class='text-muted'>
                    <strong>Optionally </strong><br>
                    If you can't see all the effects clearly 
                    <strong class='col-dark'><i class="fas fa-hand-rock"></i></i> Drag </strong> 
                    a trait to reposition it 
                </p>
            </div>
            `, 
            btnText: `Click to intervene. Got it.`,
        },
        {
            id: 'tutorial-intv-lines',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: null,
            gameStateSpecific: null,
            title: 'Line colors', 
            body: `
                <strong>Arrows represent causal relationships between traits</strong>
                <br><br>
                <p class='col-pos'><i class="fas fa-arrow-right"></i> <strong class='col-pos'>Red</strong> arrows represent <strong class='col-pos'>increases</strong></p>
                <p class='col-neg'><i class="fas fa-arrow-right"></i> <strong class='col-neg'>Blue</strong>  arrows represent <strong class='col-neg'>decreases</strong></p>
                <br>
                <p class='text-muted'>Hint: There is a key in the bottom left of the screen if you get stuck</p>
            `, 
        },
        {
            id: 'tutorial-intv-source',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: null,
            gameStateSpecific: null,
            title: 'Intervening on a trait', 
            body: `
            <div class='d-flex flex-column justify-content-center'>    
                <img src='images/tutorial/intervention-source.gif' class='m-2 d-flex align-self-center' style='height: 200px; width: auto; border-radius: 5px;'>
                <br>
                <strong>Interventions improve traits</strong>
                <p>Good traits will be <strong>increased</strong>
                <br>
                Bad traits will be <strong>reduced</strong></p>
            </div>
            `, 
        },
        {
            id: 'tutorial-intv-effects',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: null,
            gameStateSpecific: null,
            title: 'Intervention effects', 
            body: `
            <div class='d-flex flex-column justify-content-center'>
                <img src='images/tutorial/intervention-effects.gif' class='m-2 d-flex align-self-center' style='height: 200px; width: auto;  border-radius: 5px;'>
                <br>
                <p>
                    Interventions <strong>enhance</strong> the effects of <strong>good</strong> traits 
                    <br> Interventions <strong>diminish</strong> the effects of <strong>bad</strong> traits 
                </p>
            </div>
            `, 
        },
        {
            id: 'tutorial-iv-goals',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: null,
            gameStateSpecific: 'iv',
            title: 'Goals', 
            body: `
                You are free to use this visualisation however you like but you might want to try: 
                <br><br>
                <ul class='text-left'>
                    <li> Hover over a trait to see its name and prevalence </li> 
                    <li> Intervene on education and see that it has far-reaching effects </li> 
                    <li> Intervene on BMI and see that when it is reduced heart disease (CHD) is also reduced </li> 
                    <li> Make one intervention after another and see how their effects interact </li> 
                </ul>         
            `, 
        }, //tutorial-intv-effects-btn
        {
            id: 'tutorial-game-level',
            position: {
                type: 'onElement',
                element: 'GUI-planetInfo',
                x: null,
                y: null,
            },
            trigger: 'tutorial-intv-effects-btn',
            reveal: 'GUI-currentPlanet-div',
            gameStateSpecific: 'game',
            title: `<i class="fas fa-hand-point-up" style='font-size: 3em;'></i>`, 
            body: `
                You are level 1.
                <br><br>
                Level up by achieving goals <i class="fas fa-fire"></i>
            `, 
            btnText: `So I have to level up? Ok <i class="fas fa-fire"></i>`,
        }, 
        {
            id: 'tutorial-game-exp',
            position: {
                type: 'onElement',
                element: 'GUI-planetInfo',
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: 'progress-goal-div-div',
            gameStateSpecific: 'game',
            title: `<i class="fas fa-hand-point-up" style='font-size: 3em;'></i>`, 
            body: `
                This bar shows your progress towards the next level 
            `, 
            btnText: `Got it.`,
        },         
        {
            id: 'tutorial-game-goals',
            position: {
                type: 'onElement',
                element: 'GUI-planetInfo',
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: 'GUI-goal',
            gameStateSpecific: 'game',
            title: `<i class="fas fa-hand-point-up" style='font-size: 3em;'></i>`, 
            body: `
                Here is your first goal <i class="fas fa-medal"></i>
                <br><br>
                Goals are random and might not always be achievable but try your best to enact policies which benefit people
            `, 
            btnText: `<i class="fas fa-thumbs-up"></i>`,
        }, 
        {
            id: 'tutorial-game-start',
            position: {
                type: 'onElement',
                element: 'GUI-planetInfo',
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: 'progress-goal-div-div',
            gameStateSpecific: 'game',
            title: ``, 
            body: `
                You are now ready to start making interventions! Have a go now
            `, 
            btnText: `Let's go! <i class="fas fa-mouse-pointer"></i>`,
        }, 
        {
            id: 'tutorial-game-interventionMade',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'onIntervention',
            reveal: null,
            gameStateSpecific: 'game',
            title: `You made an intervention!`, 
            body: `
                <div class='d-flex flex-column justify-content-center'>
                    <img src='images/tutorial/levelup.gif' class='m-2 d-flex align-self-center' style='height: 200px; width: auto;  border-radius: 5px;'>
                    <p><br>Depending on the effects of your intervention you may have made some progress towards levelling up!</p>
                </div>
            `, 
            btnText: `Continue`,
        },
        {
            id: 'tutorial-game-enactPolicy',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: null,
            gameStateSpecific: 'game',
            title: `Policies`, 
            body: `
                <p>Well done, now you have made an intervention it's time to enact it as a policy!</p>
                <p>Enacting policies will show you how effective your intervention was on a leaderboard <i class="fas fa-crown"></i></p>
                <p class='text-muted'>Note: Later on in the game you might need to make more interventions 
                before you can make a policy</p>
            `, 
            btnText: `Continue`,
        },
        {
            id: 'tutorial-game-enactPolicy2',
            position: {
                type: 'onElement',
                element: 'GUI-planetInfo',
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: null,
            gameStateSpecific: 'game',
            title: `<i class="fas fa-hand-point-up" style='font-size: 3em;'></i>`, 
            body: `
                The levelling bar above will turn into a button saying 'Enact Policy' when you can enact a policy
                <br><br>
                Click it now!
            `, 
            btnText: `Okay`,
        },
        {
            id: 'tutorial-game-policyEnacted',
            position: {
                type: 'onElement',
                element: 'win-screen-notice',
                x: null,
                y: null,
            },
            trigger: 'startup',
            reveal: null,
            gameStateSpecific: 'game',
            title: ``, 
            body: `
                <p>This screen will show you how effective your policy achieved the goal and whether anyone found a better policy. Players anonymised.</p>
                <p>Hint: Beat other players by finding the best policies to level up faster! <i class="fas fa-crown"></i></p>
            `, 
            btnText: `Dismiss`,
        },
        {
            id: 'tutorial-game-levelup',
            position: {
                type: 'onElement',
                element: 'levelup-notice',
                x: null,
                y: null,
            },
            trigger: 'startup',
            reveal: null,
            gameStateSpecific: 'game',
            title: `Unlocks <i class="fas fa-plus"></i>`, 
            body: `
                Each time you level up you can unlock a new ability to power up your interventions
            `, 
            btnText: `Dismiss`,
        }, 
        {
            id: 'tutorial-game-final',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'modal-lvlup-btn',
            reveal: null,
            gameStateSpecific: 'game',
            title: `You completed the tutorial`, 
            body: `
                You now know how the game works! <i class="fas fa-book"></i>
                <br><br>
                You are now on level 2.
                <br>
                The game ends once you reach level 6. 
            `, 
            btnText: `Level 6 here I come  <i class="fas fa-fire">`,
        }, 
        
    ]
    
    // Display tutorials in sequence
    for(const n in dialogs){
        const dialog = dialogs[n];
        
        // Show some dialog boxes for certain game modes only
        if(dialog.gameStateSpecific){
            if(!(gameState === dialog.gameStateSpecific)){
                continue;
            }
        }

        // Make dialog
        constructMessage(dialog);
        
        // Set up trigger
        if(dialog.trigger == 'startup'){

            // Show this on start up
            $(`#${dialog.id}`).show().animate({opacity: 1}, 500);
            if(dialog.reveal){  $(`#${dialog.reveal}`).show().animate({opacity: 1}, 500) };

        } else if (dialog.trigger == 'onPrevious'){
            
            // Show dialog once previous has been dismissed
            const previousDialog = dialogs[n-1];
            $(`#${previousDialog.id}-btn`).click(function(){
                $(`#${dialog.id}`).show().animate({opacity: 1}, 500);
                if(dialog.reveal){  revealComponents(dialog.reveal); };
            });

        } else if (dialog.trigger === 'onIntervention'){

            // Listen for intervention event
            document.addEventListener("playerMadeIntervention", function(){
                
                // Fire only once
                if(eventFired[dialog.id]==true){return};
                eventFired[dialog.id]=true;

                // Show this when a specific button is pressed
                $(`#${dialog.id}`).show().animate({opacity: 1}, 500);
                if(dialog.reveal){  revealComponents(dialog.reveal); };

            });

        } else {
            
            $(`#${dialog.trigger}`).one('click', function(){

                // Show this when a specific button is pressed
                $(`#${dialog.id}`).show().animate({opacity: 1}, 500);
                if(dialog.reveal){  revealComponents(dialog.reveal); };
    
            });

        };

        function revealComponents(comp){
            $(`#${comp}`).show().animate({opacity: 1}, 500)
        }
        
    }

}

/*
// Initialise tutorial dialogues
function initialiseTutorial(){

    
    // Show intro welcome text
    $('#tutorial-0-modal').modal('show'); // Auto-show initial intro modal 

    // Set up string of tutorials
    $('#tutorial-0-modal').on('hidden.bs.modal', function(){ // On dismissing intro modal
        $('#tutorial-1').show().animate({opacity: 1}, 500);
    })
    $('#tutorial-1-btn').click(function(){ // On clicking through tutorial pop-ups
        $('#tutorial-1').hide();
        $('#tutorial-2').show().animate({opacity: 1}, 500);
        $('#GUI-goal').show().animate({opacity: 1}, 500);
    });
    $('#tutorial-2-btn').click(function(){
        $('#tutorial-2').hide();
        $('#tutorial-'game'').show().animate({opacity: 1}, 500);
        $('#svg-main').show().animate({opacity: 1}, 500);
    });
    $('#tutorial-'game'-btn').click(function(){
        $('#tutorial-'game'').hide();
        $('#tutorial-4').show().animate({opacity: 1}, 500);
    });
    $('#tutorial-4-btn').click(function(){
        $('#tutorial-4').hide();
    });
    $('#intervention-modal').one('shown.bs.modal', function(){ // On selecting trait  (! curr ver does not support)
        $('#tutorial-5').show().animate({opacity: 1}, 500);
    })
    $('#intervention-modal').one('hidden.bs.modal', function(){ // On intervention dialogue  (! curr ver does not support)
        $('#tutorial-5').hide();
    })
    $('#tutorial-5-btn').click(function(){
        $('#tutorial-5').hide();
    });
    $('#win-screen-btn').one('click', function(){ // On dismissing win screen
        $('#tutorial-6').show().animate({opacity: 1}, 500);
    }); 
    $('#tutorial-6-btn').click(function(){
        $('#tutorial-6').hide();
    });

}
*/