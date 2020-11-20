/*

Intro
=====
Description: This file contains functions to produce the introduction cinematic and logic for the game

Use: This file is called by the mains script on load.

*/

// Variable to stop space traffic
var stopSpaceTraffic = false;

// Prepare splash login
function splash(){
    
    // Play intro music
    playSoundtrack('01_infinity_awaits_us');

    // Show splash login screen
    $('#splash')
        .show()
        .delay(1000)
        .animate({opacity: 1}, 1000)
        .delay(3000)
        .animate({top: 100}, 2000)
    $('#splash-planet')
        .show()
        .delay(3000)
        .animate({opacity: 1}, 1500)
    $('#splash-login')
        .show()
        .delay(6000)
        .animate({opacity: 1}, 1500)

    // Make rockets fly across the screen
    setTimeout(function(){
        createSpaceTraffic(4);
    }, 6000)
}


function dismissSplash(){

    // Hide splash
    $('#splash').animate({opacity: 0}, 500).delay(500).hide(0);
    $('#splash-login').animate({opacity: 0, right:'-50vw'}, 500).delay(500).hide(0);
    $('#splash-planet').delay(1000).animate({opacity: 0}, 500).delay(500).hide(0);

    // Stop space traffic
    stopSpaceTraffic = true;
}


// Constant variables for space traffic
const depths = [
    {zIndex: 0, speedMult:2, size:'0.15', height:`${5+Math.floor(Math.random()*10)}vh`}, // Behind planet 
    {zIndex: 0, speedMult:1.75, size:'0.3', height:`${5+Math.floor(Math.random()*20)}vh`},
    {zIndex: 1, speedMult:1.5, size:'0.45', height:`${5+Math.floor(Math.random()*45)}vh`}, // Infront of planet 
    {zIndex: 1, speedMult:1.25, size:'0.60', height:`${5+Math.floor(Math.random()*70)}vh`},
    {zIndex: 1, speedMult:1, size:'0.75', height:`${25+Math.floor(Math.random()*70)}vh`},
    {zIndex: 1, speedMult:0.75, size:'0.85', height:`${25+Math.floor(Math.random()*70)}vh`},
    {zIndex: 2, speedMult:0.5, size:'1', height:`${25+Math.floor(Math.random()*70)}vh`}, // In front of GUI
]
const rockets = [
    {name: 'rocket_mule', size: '200'},
    {name: 'rocket_emperor', size: '150'},
    {name: 'rocket_whale', size: '150'},
    {name: 'rocket_explorer1', size: '150'},
    {name: 'rocket_explorer2', size: '125'},
    {name: 'rocket_prestige', size: '50'},
    {name: 'rocket_comet', size: '150'},
];
const directions = [
    {start:'-50vw', end:'150vw', transform:''}, {start:'150vw', end:'-50vw', transform:'rotateY(180deg)'}
];


// Function to make rockets fly across the screen
function createSpaceTraffic(numberOfFlights, minimumTimeOnScreen = 500, immutable = false){
    
    // Ensure space traffic is enabled
    stopSpaceTraffic = false;

    // Launch spaceships
    while(numberOfFlights > 0){
        createBGAudio(`rocketWoosh-${numberOfFlights}`); // Create a new audio object for each space ship so each can be heard simultaneously
        createSpaceship(numberOfFlights, immutable); // Create space ship graphic and play sounds in a self-looping function until cancelled
        numberOfFlights--;
    };

    // Self-looping function to launch a single spaceship
    function createSpaceship(currentFlightNumber, immutable = false){
        // Don't spawn any more traffic if traffic has been stopped (e.g., dismissing the splash screen)
        if(immutable){
            // continue;
        }else{
            if(stopSpaceTraffic){
                return
            };
        }

        // Pick rocket graphic randomly
        const randomRocket = rockets[getRandomInt(rockets.length)];
        
        // Pick directions of travel randomly
        const randomDirection = directions[getRandomInt(directions.length)];

        // Pick rocket depth randomly (behind or in front of other layers)
        const depth = depths[getRandomInt(depths.length)];

        // Pick rocket speed randomly
        const speed = Math.floor(Math.random()*15000) * depth.speedMult + minimumTimeOnScreen;

        // Create rocket and animate
        $('<img>', {
            id: `rocket${Math.floor(Math.random()*100)}`,
            src: `images/ships/${randomRocket.name}.png`,
            class: 'rocket',
            css: {
                transform:  randomDirection.transform,
                position:   'absolute',
                top:        depth.height,
                left:       randomDirection.start,
                width:      'auto',
                height:     randomRocket.size * depth.size,
                zIndex:     depth.zIndex,
            }
        }).appendTo( document.body ).animate({ // Animate rocket on appending to body
            left:  randomDirection.end  
        }, speed).delay(speed).queue(function() { $(this).remove(); });

        // Play sound effect
        playShipSound(`rocketWoosh-${currentFlightNumber}`, speed);

        // Repeat this function on a random delay
        setTimeout(function(){
            createSpaceship(currentFlightNumber, immutable);
        }, speed)
    }

    // Function to generate random number (from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}


// Function to play intro cinematic
function playIntro(){

    /*
    // Select SVG DOM element
	const svg = d3.select('#svg-intro'),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        viewBox = +svg.attr("viewBox", `0 0 100 100`);
    console.log(`Got SVG (${width} x ${height})`);

    // Add rockets
    var rocket1 = svg.append('image')
        .attr('xlink:href', 'images/animation/rocket1.png')
        .attr('x', -15)
        .attr('y', 75)
        .attr('width', 10)
        .attr('height', 10)
        .attr('id', 'rocket1');
    var rocket2 = svg.append('image')
        .attr('xlink:href', 'images/animation/rocket2.png')
        .attr('x', -25)
        .attr('y', 85)
        .attr('width', 10)
        .attr('height', 10)
        .attr('id', 'rocket2');
    var rocket3 = svg.append('image')
        .attr('xlink:href', 'images/animation/rocket3.png')
        .attr('x', -10)
        .attr('y', 75)
        .attr('width', 10)
        .attr('height', 10)
        .attr('id', 'rocket3');
    
    const defs = svg.append("defs");
    const mask = defs.append("myMask")
		.attr("id", 'mask');
        mask.append("circle")
            .attr("cx", 100)
            .attr("cy", 60)
            .attr("r", 60)
            .attr("fill", "white")
        mask.append("circle")
            .attr("cx", 100)
            .attr("cy", 60)
            .attr("fill", "black")
            .attr("r", 30)


    // Add planet
    var planet = svg.append('image')
        .attr('xlink:href', 'images/animation/planet.png')
        .attr('x', -15)
        .attr('y', 65)
        .attr('width', 50)
        .attr('height', 50)
        .attr('id', 'planet')
        .attr('mask', 'url(#myMask)');
    var lowerclouds = svg.append('image')
        .attr('xlink:href', 'images/animation/clouds-lower.png')
        .attr('x', -100)
        .attr('y', 65)
        .attr('width', 200)
        .attr('height', 50)
        .attr('id', 'planet')
        .attr('mask', 'url(#myMask)');
    var upperclouds = svg.append('image')
        .attr('xlink:href', 'images/animation/clouds-upper.png')
        .attr('x', -100)
        .attr('y', 65)
        .attr('width', 200)
        .attr('height', 50)
        .attr('id', 'clouds')
        .attr('mask', 'url(#myMask)');
    
    d3.select('#clouds').transition()
        .duration(15000)
        .attr('x', 100)
        .attr('y', 65);

    d3.select('#rocket1').transition()
        .delay(500)
        .duration(15000)
        .attr('x', 150)
        .attr('y', -50);
    d3.select('#rocket2').transition()
        .delay(500)
        .duration(15000)
        .attr('x', 150)
        .attr('y', -50);
    d3.select('#rocket3').transition()
        .delay(500)
        .duration(15000)
        .attr('x', 150)
        .attr('y', -50);
    */
}