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
            id: 'tutorial-data',
            name: 'The data',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'startup',
            reveal: null,
            gameStateSpecific: null,
            title: 'Our dataset', 
            body: `
                <p class='text-left'>
                    We have analysed 
                    ${tip('genomics datasets',`Large datasets containing information on genetic make-up and phenotypes such as behaviours and health`)} 
                    containing information on around a million participants 
                    to create a public health simulation. 
                    It simulates the 
                    ${tip('population prevalence', `A measure of how common a trait is (a trait with higher prevalence means that it is more common)`)}
                    and effects of seventeen health, wellbeing, mental health and behavioural traits. 
                    <br><br>
                    Please be aware that this simulation might appear  
                    ${tip('incomplete', `For example in this simulation exercise does not help you lose weight...`)} 
                    but try to learn this data even if your own knowledge tells you it might not be quite right!
                </p>
            `, 
        },
        {
            id: 'tutorial-whatdoido',
            name: 'Your aim',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: null,
            gameStateSpecific: null,
            title: 'Using the simulation', 
            body: `
                <p class='text-left'>
                    We are putting you in the position of public health policy maker for a population.
                    <br><br>
                    <strong>What is my aim?</strong><br>
                    Maximise the 
                    ${tip('prevalence', `A measure of how common a trait is (a trait with higher prevalence means that it is more common)`)}
                    of 
                    ${tip('good traits', 'For example wellbeing and intelligence' )} 
                    and minimise the 
                    ${tip('prevalence', `A measure of how common a trait is (a trait with higher prevalence means that it is more common)`)} 
                    of 
                    ${tip('bad traits', 'For example heart disease (CHD) and diabetes' )}
                    <br><br>
                    <strong>How do I do this?</strong><br>
                    Learn the relations between traits and make 
                    ${tip('interventions', 'Simulate the effects of changing the prevalence of a trait' )} 
                    to affect changes in traits
                    <br><br>
                    A short <strong>tutorial</strong> will help you understand the data visualisation and 
                    how to make interventions using this software. 
                    Please read the dialogues and press the yellow buttons to continue
                </p>
            `, 
        },
        {
            id: 'tutorial-intv-lines',
            name: 'Understanding arrows in the visualisation',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: null,
            gameStateSpecific: null,
            title: 'Identifying relationships', 
            body: `
                <div class='d-flex flex-column justify-content-center'>  
                    <p>
                        Arrows represent 
                        ${tip('causal relationships', 'A change in one trait causes a change in another')} 
                        between traits
                    </p>
                    <img src='images/tutorial/key.JPG' class='m-2 d-flex align-self-center' style='height: 200px; width: auto;  border-radius: 5px;'>
                    <p class='text-muted'>The key in the bottom left of the screen shows this in case you forget</p>
                </div>
            `, 
        },
        {
            id: 'tutorial-controls',
            name: 'The controls',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: null,
            gameStateSpecific: null,
            title: 'Interacting with the simulation', 
            body: `
            <div class='d-flex flex-column justify-content-center'>    
            <img src='images/tutorial/controls.gif' class='m-2 d-flex align-self-center' style='height: 200px; width: auto;  border-radius: 5px;'>
                <br><br>
                <p><strong><i class="fas fa-mouse"></i> Click </strong> <br> On a trait to intervene on it </p>
                <p><strong><i class="fas fa-mouse-pointer"></i> Hover </strong><br> Over a trait to see its <strong>name</strong>, <strong>prevalence</strong> and <strong>effects</strong>
            </div>
            `, 
            btnText: `Click to intervene. Got it.`,
        },
        {
            id: 'tutorial-propagation',
            name: 'Propagation',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: null,
            gameStateSpecific: null,
            title: 'Propagation', 
            body: `
            <div class='d-flex flex-column justify-content-center'>    
                <img src='images/tutorial/propagation.gif' class='m-2 d-flex align-self-center' style='height: 200px; width: auto;  border-radius: 5px;'>
                <p>
                    When you make an intervention the effects will be shown to you as they 
                    ${tip('propagate', 'Spread widely from one trait to another' )} 
                    through the network
                </p>
            </div>
            `, 
            btnText: `I see.`,
        },
        {
            id: 'tutorial-intv-lineWidth',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: null,
            gameStateSpecific: null,
            title: 'Identifying relationship strengths', 
            body: `
                <div class='d-flex flex-column justify-content-center'>    
                    <strong>Line widths represent the strength of relationships</strong>
                    <img src='images/tutorial/scale.png' class='m-2 d-flex align-self-center' style='height: 200px; width: auto;  border-radius: 5px;'>
                    <br>
                    <p class='text-muted'>The scale in the bottom left of the screen shows 
                    by how much a relationship affects a trait's 
                    ${tip('prevalence', `A measure of how common a trait is (a trait with higher prevalence means that it is more common)`)} 
                    compared to normal</p>
                </div>
            `, 
        },
        {
            id: 'tutorial-intv-source',
            name: 'How interventions change good and bad traits',
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
            name: 'Understanding the effects of interventions',
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
                    Interventions 
                    ${tip('enhance', 'Effects will be stronger (For example, raising education will increase its positive effect on intelligence, thus raising intelligence)')} 
                    the effects of <strong>good</strong> traits 
                    <br> Interventions 
                    ${tip('diminish', 'Effects will be weaker (For example, reducing depression will reduce its negative effect on wellbeing, thus raising wellbeing)')} 
                    the effects of <strong>bad</strong> traits 
                </p>
            </div>
            `, 
        },
        {
            id: 'tutorial-iv-goals',
            name: 'Suggested goals',
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
            name: 'How to level up',
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
            name: 'Seeing your progress towards the next level',
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
            name: 'In-game goals',
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
            `, 
            btnText: `<i class="fas fa-thumbs-up"></i>`,
        },          
        {
            id: 'tutorial-game-unachievableGoals',
            name: 'Unachievable goals',
            position: {
                type: 'auto',
                element: null,
                x: null,
                y: null,
            },
            trigger: 'onPrevious',
            reveal: null,
            gameStateSpecific: 'game',
            title: `About goals...`, 
            body: `
                <strong>Goals are random</strong>
                <br>
                They might not always be achievable but try your best to enact policies which benefit people
                <br><br>                
                <strong>Beat the computer!</strong>
                <br>
                You are competing against the computer to find the best interventions! <i class="fas fa-robot"></i>
                <br><br>
                You are now ready to start making interventions! Have a go at making an intervention now
            `, 
            btnText: `Let's go! <i class="fas fa-mouse-pointer"></i>`,
        },
        {
            id: 'tutorial-game-interventionMade',
            name: 'Level up by making interventions',
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
            name: 'What policies are',
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
                <p> Enacting policies will show you how well your interventions compared to the best policy 
                found by the computer! <i class="fas fa-robot"></i></p>
                <p class='text-muted'>Note: Later on in the game you might need to make more interventions 
                before you can make a policy</p>
            `, 
            btnText: `Continue`,
        },
        {
            id: 'tutorial-game-enactPolicy2',
            name: 'How to enact a policy',
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
                Now press 'Enact policy'!
            `, 
            btnText: `Okay`,
        },
        {
            id: 'tutorial-game-policyEnacted',
            name: 'The leaderboard (in leaderboard screen)',
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
                <p>This screen will show you how effective your policy was. 
                Beat the computer by finding the best policies and level up faster! 
                <i class="fas fa-crown"></i></p>
            `, 
            btnText: `Dismiss`,
        },
        {
            id: 'tutorial-game-levelup',
            name: 'Unlocking new abilities (in level-up screen)',
            position: {
                type: 'onElement',
                element: 'levelup-notice',
                x: null,
                y: null,
            },
            trigger: 'startup',
            reveal: null,
            gameStateSpecific: 'game',
            title: ``, 
            body: `
                Each time you level up you can unlock a new ability to power up your interventions!
                <br><br>
                Try unlocking the ability to make two interventions per policy now <i class="fas fa-plus"></i>
            `, 
            btnText: `Dismiss`,
        }, 
        {
            id: 'tutorial-game-final',
            name: 'The end of the game',
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
                The game ends once you reach level ${Object.entries(levels).length}. 
            `, 
            btnText: `Level ${Object.entries(levels).length} here I come  <i class="fas fa-fire">`,
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

        // Add as topic to help page
        var help = document.createElement('BUTTON');
            help.innerHTML = dialog.name;
            help.style.display = 'block';
            help.className = 'btn btn-custom m-2';
            help.onclick = function(){
                $(`#${dialog.id}`).show().animate({opacity: 1}, 500);
                $(`#menu-help`).modal('hide');
            }
        document.getElementById('menu-help-content').appendChild(help)
        
        // Trigger on startup
        if(dialog.trigger == 'startup'){

            // Show this on start up
            $(`#${dialog.id}`).show().animate({opacity: 1}, 500);
            if(dialog.reveal){  $(`#${dialog.reveal}`).show().animate({opacity: 1}, 500) };

        // Trigger on previous dialogue dismiss
        } else if (dialog.trigger == 'onPrevious'){
            
            // Show dialog once previous has been dismissed
            const previousDialog = dialogs[n-1];
            $(`#${previousDialog.id}-btn`).one('click', function(){
                $(`#${dialog.id}`).show().animate({opacity: 1}, 500);
                if(dialog.reveal){  revealComponents(dialog.reveal); };
            });
        // Trigger on player made intervention
        } else if (dialog.trigger === 'onIntervention'){

            // Listen for intervention event
            document.addEventListener("playerMadeIntervention", function(){
                
                // Fire only once
                if(eventFired[dialog.id]==true){return};
                eventFired[dialog.id]=true;

                // Delay by 5s
                setTimeout(function(){

                    // Show this when intervention is pressed
                    $(`#${dialog.id}`).show().animate({opacity: 1}, 500);
                    if(dialog.reveal){  revealComponents(dialog.reveal); };
                }, 5000)

            });

        // Trigger on a specific button press
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

    // Enable popovers
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    // Function to generate tooltips
    function tip(text, tip){
        return `<a href="#" data-toggle="tooltip" title="${tip}">${text}</a>`;
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