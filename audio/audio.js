/*

Audio
=====
Description: 
This file creates Audio objects for the game

Use: These functions are called by the main and secondary scripts when sound effects and music are needed

*/

// Sound effects volume
var sfxVolume = 0.1;

// Function to create new background audio objects (e.g., space ship sounds)
function createBGAudio(id){
    
    // Create audio object and append to DOM
    var audio = new Audio();
        audio.id = id;
        audio.volume = sfxVolume;
    document.body.appendChild(audio);

}

// Create soundtrack audio elements


    // Create win screen progress audio sound
    var progressSound = new Audio();
        progressSound.src = `audio/sounds/event-positive/moment2.mp3`;

    // Define songs in soundtrack
    const soundtrack = [
        '04_artificial_serenity',   
        'space/space_imagine',     
    ]

    // Create sound object for music
    var music = new Audio();
        music.id = 'soundtrack';
        music.addEventListener('ended', function(){playSoundtrack()});
        music.volume = 0.3;
        document.body.appendChild(music);

    // Function to play songs from soundtrack
    function playSoundtrack(song = false){

        // Transition music out
        $('#soundtrack').animate({volume: 0}, 2000);

        // Set music
        setTimeout(function(){

            // Transition music back in
            $('#soundtrack').animate({volume: 0.3}, 2000);

            // Play a specified song (if specified)
            if(song){ 
                music.src = `audio/music/${song}.mp3`;
                    music.play();
            }

            // Else play a random song from soundtrack
            else { 
                const randomSong = Math.floor(Math.random() * Math.floor(soundtrack.length));
                music.src = `audio/music/${soundtrack[randomSong]}.mp3`;
                    music.play();
            }

        }, 1000)

    }

// Create sound effects audio elements

    // Create audio elements for sound
    var sound_ui = new Audio(); // Sound feedback for player actions in the UI
        sound_ui.volume = sfxVolume;

    // Define sound effects
    const sounds_spaceTraffic = [
        'flyby_fast_1.mp3',
        'flyby_fast_2.mp3',
        'flyby_med_1.mp3',
        'flyby_med_2.mp3',
        'flyby_slow_1.wav',
        'flyby_veryfast_1.wav',
        'flyby_veryslow_1.mp3',
    ]
    
    // Function to play songs from soundtrack
    function playShipSound(audioObject, shipSpeed, volume = sfxVolume){
        
        // Get audio element
        var audio = document.getElementById(audioObject);
            audio.volume = volume;

        // Choose a space ship sound based on its speed
        if      (shipSpeed > 12500){
            audio.src = `audio/sounds/ships/${'flyby_slow_1.wav'}`;
        }else if(shipSpeed > 10000){
            audio.src = `audio/sounds/ships/${'flyby_med_1.mp3'}`;
        }else if(shipSpeed > 7500){
            audio.src = `audio/sounds/ships/${'flyby_med_2.mp3'}`;
        }else if(shipSpeed > 5000){
            audio.src = `audio/sounds/ships/${'flyby_fast_1.mp3'}`;
        }else{
            audio.src = `audio/sounds/ships/${'flyby_veryfast_1.wav'}`;
        }

        // Play sound
        audio.play();
    }

// Function to give all buttons a sound effect on press
function addButtonPressSound(){
    
    // Create button audio sound
    var buttonPressSound = new Audio();
        buttonPressSound.src = `audio/sounds/ui/effect-good.wav`;

    // Play sound on button press
    $('button').click(function(){
        buttonPressSound.play();
    })
}


// Function to control volume
function addVolumeSlider(){

    // Get slider and soundtrack
    var slider = document.getElementById("volume-slider");
    var output = document.getElementById("soundtrack");

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        output.volume = this.value/100;
        sfxVolume = this.value/200;
    }
}