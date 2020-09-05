/*

Settings
========
Description: This file contains settings for the mirana visualisation central to the game. 
It gets the default mirana settings and changes values to make it display better for the game.
Use: This file is called up loading up the page.

*/

// Import default MiRANA settings 
var settings = defaultSettings;

// Customise MiRANA network visualisation settings for game 

    /* Nodes */

    // New settings attributes for game
    settings.nodes.circleRadius_min = 10;
    settings.nodes.circleRadius_max = 50;

    // Enlarge circles to fit icons
    settings.nodes.circleRadius = 30; 

    // Enable icons
    settings.nodes.icons.enabled = true; 

    // Custom node width function
    settings.nodes.onHover.enter.calcCircleRadius = function(){
        return gameData.nodes[this.parentNode.id].circleRadius * 2};

    settings.nodes.onHover.enter.calcIconSize = function(){
        return gameData.nodes[this.parentNode.id].circleRadius * 4};

    settings.nodes.onHover.enter.calcIconPosition = function(){
        return -gameData.nodes[this.parentNode.id].circleRadius * 2};

    settings.nodes.onHover.exit.calcCircleRadius = function(){
        return gameData.nodes[this.parentNode.id].circleRadius};

    settings.nodes.onHover.exit.calcIconSize = function(){
        return gameData.nodes[this.parentNode.id].circleRadius * 2};

    settings.nodes.onHover.exit.calcIconPosition = function(){
        return -gameData.nodes[this.parentNode.id].circleRadius};

    // Change text labels since we have icons for labels
    settings.nodes.labels.posX = 0; // Center node labels 
    settings.nodes.labels.anchor = 'middle';
    settings.nodes.labels.class = 'nodeLabel'; // Start hidden
    settings.nodes.labels.color = 'white'; // Label text color
    settings.nodes.labels.background = 'black'; // Label bg color
    settings.nodes.labels.posY = settings.nodes.circleRadius*2 + 20; // Appear below nodes

    // Give custom class to nodes for on.hover decoration
    settings.nodes.class = 'nodeCircle';

    // Animate nodes
    settings.simulation.animation.enabled = true;
    settings.simulation.animation.hoverToEnlarge_opacity = true;

    /* Links */

    // Make link widths proportionate to their propagation effects
    settings.links.scaleToBeta.maxWidth = settings.links.scaleToBeta.minWidth + (settings.links.scaleToBeta.scaleFactor * 5);
    settings.links.width = d => settings.links.scaleToBeta.calcScaledWidth(d.b_pct);
    settings.links.scaleToBeta.calcScaledWidth = function(b){
        return(Math.min(settings.links.scaleToBeta.minWidth+(b/100*settings.links.scaleToBeta.scaleFactor), settings.links.scaleToBeta.maxWidth));}, // Method to calculate scale

    // Modify edges for visibility
    settings.links.opacity = 0.8;
    settings.links.scaleToBeta.minWidth = 1;
    settings.links.scaleToBeta.scaleFactor = 5;
    settings.links.scaleToBeta.scaleFactor = 5;

    // Change color pallet
    settings.links.colNeg = 'cornflowerblue';
    settings.links.colPos = 'coral';