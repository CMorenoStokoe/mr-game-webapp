/*

Audio
=====
Description: 
This file creates Audio objects for the game

Use: These functions are called by the main and secondary scripts when sound effects and music are needed

*/

// Function to create new background audio objects (e.g., space ship sounds)
function createBGAudio(id){
    
    // Create audio object and append to DOM
    var audio = new Audio();
        audio.id = id;
        audio.volume = 0.5;
    document.body.appendChild(audio);

}

// Create soundtrack audio elements

    // Define songs in soundtrack
    const soundtrack = [
        '01_infinity_awaits_us',
        '02_miniboss',
        '03_imagine',
        '04_artificial_serenity',
        '05_castles_of_ice',
        '06_tetanus',
        '07_flora',
        '08_glades',
        '09_village',
        '10_cascade',
        '11_claustrophobia',
        '12_boss',
        '13_spheres',
        '14_skeletons',
        '15_men_of_stone',
        '16_deaths_embrace',
        '17_omnia_peratus',        
    ]

    // Create sound object for music
    var music = new Audio();
        music.addEventListener('ended', function(){playSoundtrack()});

    // Function to play songs from soundtrack
    function playSoundtrack(song = false){
        if(song){ // Play a specific song
            music.src = `audio/music/${song}.mp3`;
                music.play();
        }
        else{ // Else choose a random song to play
            const randomSong = Math.floor(Math.random() * Math.floor(soundtrack.length));
            music.src = `audio/music/${soundtrack[randomSong]}.mp3`;
                music.play();
        }
    }

// Create sound effects audio elements

    // Create audio elements for sound
    var sound_ui = new Audio(); // Sound feedback for player actions in the UI

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
    function playShipSound(audioObject, shipSpeed){
        
        // Get audio element
        var audio = document.getElementById(audioObject);

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

// Function to change volume
//$music.animate({volume: volume}, fade);