/*

Intro
=====
Description: This file contains functions to produce the introduction cinematic and logic for the game

Use: This file is called by the mains script on load.

*/

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

// Variable to stop space traffic
var stopSpaceTraffic = false;

// Prepare splash login
function splash(){

    // Show splash planet
    document.getElementById('splash-planet').style.opacity = 1;

    // Show splash login screen
    $('#splash')
        .delay(1000)
        .animate({opacity: 1}, 500)
        .delay(1000)
        .animate({top: 100}, 2000)
    $('#splash-login').delay(4500).animate({opacity: 1}, 1500)

    // Make rockets fly across the screen
    createSpaceTraffic(4);
}

function dismissSplash(){

    // Hide splash
    $('#splash').animate({opacity: 0}, 500)
    $('#splash-login').animate({opacity: 0}, 500)
    $('#splash-planet').delay(1000).animate({opacity: 0}, 500)

    // Stop space traffic
    stopSpaceTraffic = true;
}

// Function to make rockets fly across the screen
function createSpaceTraffic(numberOfFlights, minimumTimeOnScreen = 500){

    // Launch spaceships
    while(numberOfFlights > 0){
        createSpaceship();
        numberOfFlights--;
    };

    // Self-looping function to launch a single spaceship
    function createSpaceship(){

        // Don't spawn any more traffic if traffic has been stopped (e.g., dismissing the splash screen)
        if(stopSpaceTraffic){return};

        // Pick rocket graphic randomly
        const rockets = ['rocket1', 'rocket2', 'rocket3', 'rocket4'];
        const randomRocket = rockets[getRandomInt(rockets.length)];
        
        // Pick direction of travel randomly
        const direction = [
            {start:'-20vw',end:'120vw'},
            {start:'120vw',end:'-20vw'}
        ];
        const randomDirection = direction[getRandomInt(direction.length)];

        // Pick height at which the rocket flies randomly
        const height = `${Math.floor(Math.random()*100)}vh`;

        // Pick rocket depth randomly (behind or in front of other layers)
        const depths = [
            {zIndex: 0,speedMult:0.25}, // Behind planet
            {zIndex: 1,speedMult:0.5}, // Infront of planet
            {zIndex: 3,speedMult:1}, // In front of GUI
        ]
        const depth = depths[getRandomInt(depths.length)];

        // Pick rocket speed randomly
        const speed = Math.floor(Math.random()*15000) * depth.speedMult + minimumTimeOnScreen;

        // Create rocket and animate
        $('<img>', {
            id: `rocket${Math.floor(Math.random()*100)}`,
            src: `images/animation/${randomRocket}.png`,
            class: 'rocket',
            css: {
                position:   'absolute',
                top:        height,
                left:       randomDirection.start,
                width:      '75px',
                height:     'auto',
                zIndex:     depth.zIndex,
            }
        }).appendTo( document.body ).animate({ // Animate rocket on appending to body
            left:  randomDirection.end  
        }, speed).delay(speed).queue(function() { $(this).remove(); });

        // Repeat this function on a random delay
        setTimeout(function(){
            createSpaceship();
        }, speed)
    }

    // Function to generate random number (from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}