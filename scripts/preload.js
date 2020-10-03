/*

Preload
=======
Description: 
This file preloads all assets in the game.

Use:
These functions are called on page load.

*/

// Track preload progress as loading bar for player

function preload(){

    // Initialise loading bar
    const progressBar = document.getElementById('loading-progress')
        progressBar.ariaValueMax = imagesToPreload.length + audioToPreload.length; // Set max value to number of assets to load

    // Load splash on clicking start button
    addOnclickEvent('screen-button', gamestates[0].action)
        
    // Failsafe timeout
    setTimeout(function(){
        gamestates[0].action;
        hideLoadScreen();
    }, 5000)

    // Function to advance loading bar progress
    function advanceLoadingProgress(){

        // Calculate new progress value
        const value = Number(progressBar.ariaValueNow) + 1;
        var valuePct = value / progressBar.ariaValueMax * 100;
            valuePct = `${valuePct.toFixed(0)}%`;

        // Set progress bar to new value
        progressBar.ariaValueNow = value;
        progressBar.innerHTML = valuePct;
        progressBar.style.width = valuePct;
        
        // Once fully loaded hide loading progress
        if(valuePct == '100%'){hideLoadScreen();}
    }

    // Preload assets

        // Preload images
        for(const imageURL of imagesToPreload){
            
            var img = new Image();
                img.src = imageURL;
                img.onload = function(){advanceLoadingProgress()};
        }

        // Preload audio
        for(const audioURL of audioToPreload){
            
            var audio=new Audio();
                audio.src = audioURL;
                audio.oncanplaythrough = function(){advanceLoadingProgress()};
        }
}

// Function to hide loading screen
function hideLoadScreen(){

    // Hide loading information
    $('#loading-div')
        .delay(1000)
        .animate({opacity: 0}, 1000)

    // Show play button to start game
    $('#screen-button')
        .show(0)
        .delay(1000)
        .animate({opacity: 1}, 1000)
        .click(function(){
            $('#loading-screen')
                .animate({opacity: 0}, 250)
                .delay(250)
                .hide(0)                
        }); // Hide btn on click
}