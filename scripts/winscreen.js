
/*

Win screen
=========
Description: 
This file contains code to show the win score screen 

*/

// Show win score screen
function showScoreScreen(gameData, intervention){

    // Reset score screen
        // Reset progress bar
        setHTML('win-screen-systemProgress', '');
    
        // Reset score values
        setText('score-goal', '');
        setText('score-goodness', '');
        setText('score-time', '');
        setText('score-award', '');
        setText('score-total', '');

        // Reset awards
        setHTML('score-awards', '');

    // Show win screen
    $('#win-screen').show().animate({opacity: 1}, 500);

    // Play win screen sound
    progressSound.play();

    // Populate win screen

        // Create progress
        createProgress('win-screen-progress-div', 'win-screen-systemProgress', 'progress-goal-div');
    
        // Show scores
        setTimeout(function(){
            showScore();
        }, 1000);

        // Show all awards (awards: strongest effects the intervention had)
        setTimeout(function(){
            showAwards();
        }, 4500);

        // Function to iterate through and show scores
        var scores = [];
            for(const [score, value] of Object.entries(intervention.scores)){
                scores.push({score: score, value: value});
            };
        function showScore(){

            const score = scores.shift();

            // Get element to write score to
            var elementId = null; // Id of element containing score text
            switch(score.score){
                case 'objective': elementId = 'score-goal'; break;
                case 'goodness': elementId = 'score-goodness'; break;
                case 'time': elementId = 'score-time'; break;
                case 'awards': elementId = 'score-award'; break;
                case 'total': elementId = 'score-total'; break;
            }

            // Set score
            setText(elementId, to4SF(score.value));

            // Update progress bars
            if(!(elementId == 'score-award') && !(elementId == 'score-total')){ // Skip award bar since this is added seperately after
                updateProgress(score.value);
            }

            // Loop through all scores to set
            if(scores.length>0){
                setTimeout(function(){
                    showScore(scores);
                }, 850);
            }
        }
        
        // Iterate through and show awards
        var awards = [];
            for(const [award, winner] of Object.entries(intervention.awards)){
                if(winner.id){awards.push({award: award, winner: winner})}
            };

        function showAwards(){
            const award = awards.shift();
            
            // Construct award

                // Create div to hold award
                var div = document.createElement('DIV');
                    div.id = `score-award-${award.award}`;
                    div.opacity = 0;
                    div.className = 'card award m-1';
                document.getElementById('score-awards').appendChild(div);

                var header = document.createElement('DIV');
                    header.className='card-header fnt-bold p-1 col-light bg-dark text-center';
                    // Title div with award name
                    switch(award.award){
                        case 'mostIncreased': header.innerText = 'Most increased'; break;
                        case 'mostDecreased': header.innerText = 'Most decreased'; break;
                        case 'mostGood': header.innerText = 'Best effect'; break;
                        case 'mostBad': header.innerText = 'Worst effect'; break;
                        default: break;
                    };
                div.appendChild(header);

                var body = document.createElement('DIV');
                    body.className='card-body p-1';
                    body.id=`score-award-body-${award.award}`;
                div.appendChild(body);

                var footer = document.createElement('DIV');
                    footer.className='card-footer text-muted p-1';
                    footer.style.borderTop = 'none';
                    // End award with effect on score
                    switch(award.award){
                        case 'mostIncreased': footer.innerHTML = `Score <i class="fas fa-chevron-up" style='color: green'></i>`; break;
                        case 'mostDecreased': footer.innerHTML = `Score <i class="fas fa-chevron-up" style='color: green'></i>`; break;
                        case 'mostGood': footer.innerHTML = `Score <i class="fas fa-chevron-up" style='color: green'></i><i class="fas fa-chevron-up" style='color: green'></i>`; break;
                        case 'mostBad': footer.innerHTML = `Score <i class="fas fa-chevron-down" style='color: red'></i>`; break;
                        default: break;
                    };
                div.appendChild(footer);

                // Add award winning effect bubble
                constructTraitEffectBubble(award.winner.id, award.winner.b, `score-award-bubble-${award.award}`, `score-award-body-${award.award}`);
                $(`#score-award-bubble-${award.award}`)
                    .css('opacity', 1);

            // Fade in award 
            $(`#score-award-${award.award}`)
                .animate({opacity: 1}, 850);

            // Award system progress value   
            switch(award.award){
                case 'mostIncreased': updateProgress(0.25); break;
                case 'mostDecreased': updateProgress(0.25); break;
                case 'mostGood': updateProgress(0.5); break;
                case 'mostBad': updateProgress(-0.25); break;
                default: break;
            };

            // Loop if there are awards left
            setTimeout(function(){
                if(awards.length > 0){
                    showAwards(awards);
                }
            }, 1000)
        }

        // Function to advance progress bars
        function updateProgress(value){

            // Get current value
            var progress = Number(document.getElementById('progress-goal').getAttribute('aria-valuenow'));

            // Update progress bar values
            setProgress('progress-goal-div', progress + value);
            setProgress('win-screen-progress-div', progress + value);
            
            // Update score remaining text
            const scoreToNextSystem = to4SF(Math.max(gamestates[gameState].leagueProgressMax - (progress + value), 0));
            setText('win-screen-progress-text', scoreToNextSystem);
            
            // If system complete, alter progress to show this
            if(scoreToNextSystem <= 0){
                setHTML('GUI-currentSystem', `System complete &nbsp;<i class="fas fa-check-circle"></i>`)
                document.getElementById('progress-goal').className = 'progress-bar progress-bar-striped progress-bar-animated bg-success';
            }
        }
}