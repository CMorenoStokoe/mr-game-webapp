/*

Settings
========
Description: This file contains settings for the mirana visualisation central to the game. 
It gets the default mirana settings and changes values to make it display better for the game.
Use: This file is called up loading up the page.

*/

/* Import default settings */
var settings = defaultSettings;

/* Customise MiRANA network visualisation settings for game */

// Enable icons
settings.nodes.icons.enabled = true; 

// Enlarge circles to fit icons
settings.nodes.circleRadius = 30; 

// Modify edges for visibility
settings.links.opacity = 0.8;
settings.links.scaleToBeta.minWidth = 1;
settings.links.scaleToBeta.scaleFactor = 5;

// Change color pallet
settings.links.colNeg = 'cornflowerblue';
settings.links.colPos = 'coral';

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