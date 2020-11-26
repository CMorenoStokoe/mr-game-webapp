/*

Settings
========
Description: This file contains settings for the mirana visualisation central to the game. 
It gets the default mirana settings and changes values to make it display better for the game.
Use: This file is called up loading up the page.

*/

// Import default MiRANA settings 
var settings = defaultSettings;

// Set MiRANA visualisation settings 
function setMiranaSettings(profile){

    switch(profile){

        case 'visualisation':
            settingsProfile_Default();
            settingsProfile_BetaWeights();
            settingsProfile_PermanentLabels();
            settings.nodes.fill='white';
            break;

        case 'interactiveVisualisation':
            settingsProfile_Default();
            settingsProfile_BetaWeights();
            settingsProfile_PrevalenceLabels();
            break;

        case 'test':
            settingsProfile_BetaWeights();
            settingsProfile_showIDs();
            break;

        case 'game':
            settingsProfile_Default();
            settingsProfile_BetaWeights();
            settingsProfile_PrevalenceLabels();
            settingsProfile_enableOutlines();
            break;

        default: console.log(`ERROR (#2): Unknown settings profile (${profile})`); break;
    }
}


// Default settings profile 
function settingsProfile_Default(){

    /* Colors */
    
        // Change color scheme
        settings.links.colNeg = d3.interpolateGnBu(0.75);
        settings.links.colPos = d3.interpolateOrRd(0.6);

        // Add function to color prevalence bar
        settings.nodes.colorSchemeForInterpolation = 
            d => d.change<0 ? 
                d3.interpolateGnBu(1-1*d.change_bar/100) : 
                d3.interpolateOrRd(1*d.change_bar/100),

        settings.nodes.labels.prevalenceBarColorScheme = 
            d => d.change<0 ?
                d3.interpolateGnBu(1-d.change_bar/100) : 
                d3.interpolateOrRd(d.change_bar/100);


    /* Simulation */

        //settings.simulation.strength = -3000; // Spread out nodes in graph
        settings.simulation.autoUpdate = true; // Enable force-tick auto updating of graph to and ensure it stays updated as nodes are changed

    /* Animation */
        
        // Set animation settings
        settings.simulation.animation.listenForMouseEventsOn = 'image'; // Show on hover effects on icon instead of circle (icon covers node circle)

        // Specify animations
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

    /* Nodes */

        // New settings attributes for game
        settings.nodes.circleRadius_min = 10;
        settings.nodes.circleRadius_max = 50;

        // Enlarge circles to fit icons
        settings.nodes.circleRadius = 30;

        // Enable icons
        settings.nodes.icons.enabled = true; 

        // Change text labels since we have icons for labels
        settings.nodes.labels.posX = 0; // Center node labels 
            settings.nodes.labels.anchor = 'middle';
            settings.nodes.labels.color = 'white'; // Label text color
            settings.nodes.labels.posY = settings.nodes.circleRadius + 20; // Appear below nodes
        settings.nodes.labels.background = 'black'; // Label bg color
            settings.nodes.labels.backgroundPosY = settings.nodes.labels.posY - 20; // Label bg poisition

        // Add extra information to labels
            // [setting changed in: extra-node-info.js]

        // Give custom class to nodes for on.hover decoration
        settings.nodes.class = 'nodeCircle';

        // Scale node area by prevalence instead of radius
        settings.nodes.scaleCircleArea = function(d){ 
            var circleRadius = settings.nodes.circleRadius / 100 * (100 + d); // Calculate circle scale constant
                circleRadius = Math.min(settings.nodes.circleRadius_max, circleRadius); // Clamp to min/max range
                circleRadius = Math.max(settings.nodes.circleRadius_min, circleRadius);
                circleRadius = Math.sqrt(circleRadius*100 / 3.14); // Scale by area instead of radius
            return circleRadius;
        }

    /* Links */

        // Disable bidirectional arrows since these are not used in the game
        settings.links.bidirectional.enabled = false;

        // Make overlapping edges more visible
        settings.links.opacity = 1;
        settings.arrows.opacity = 1;

        // Make arrows smaller
        settings.arrows.size = 7;
        settings.links.outlineArrowWeight = 7;
        
        // Hide edge weights
        settings.links.scaleToBeta.method = 'none'; 
        settings.links.width = 2;
}

// Settings profile to show beta weights for effects 
function settingsProfile_BetaWeights(){
    
    // Enable scale edge width to beta weight
    settings.links.scaleToBeta.method = 'percentChangeInExposure';
    settings.links.width = function(d) {return settings.links.scaleToBeta.calcScaledWidth(d.b_pct)};

    // Make edges more visible
    settings.links.scaleToBeta.minWidth = 1;
    settings.links.scaleToBeta.scaleFactor = 7;

    // Scale more accurately to their standardised effects in propagation
    settings.links.scaleToBeta.maxWidth = settings.links.scaleToBeta.minWidth + settings.links.scaleToBeta.scaleFactor;
    settings.links.scaleToBeta.calcScaledWidth = function(b){

        // Calculate relative width (in categories for easier viewing)
        /*var width = 1; 
            if(Math.abs(b) <= 10){width = 0.1*settings.links.scaleToBeta.maxWidth}
            else if(Math.abs(b) <= 25){width = 0.3*settings.links.scaleToBeta.maxWidth}
            else if(Math.abs(b) <= 40){width = 0.5*settings.links.scaleToBeta.maxWidth}
            else{width = 1*settings.links.scaleToBeta.maxWidth}
        console.log(Math.abs(b),width)  */
        return(
            Math.max( // Start with minimum width
                settings.links.scaleToBeta.minWidth,
                ( // Scale up to maximum width
                    Math.min(100, Math.max(5, Math.abs(b))) 
                    / 100 
                    * settings.links.scaleToBeta.maxWidth
                )
            )
        )
    ;}
}

function settingsProfile_enableOutlines(){
    
    // Show outlines
    settings.links.outline = true;

    // Scale lines to beta
    settings.links.outlineWidth = d => 
        settings.links.scaleToBeta.calcScaledWidth(d.b_pct) * 1.25 + 2;
    ;

}

// Settings profile to improve the visibility of static visualisation
function settingsProfile_PermanentLabels(){
    
    // Remove class
    settings.nodes.labels.class = '';

    // Position closer to node for display compatibility
    settings.nodes.labels.posY = settings.nodes.circleRadius * 0.75;
    settings.nodes.labels.backgroundPosY = settings.nodes.labels.posY - 10;
    
    // Make smaller
    settings.nodes.labels.fontSize = 12; 
    settings.nodes.labels.backgroundHeight = 12;
    settings.nodes.labels.backgroundWidth = function(d){return(settings.nodes.labels.fontSize * 7)};
    settings.nodes.labels.cornerRounding = 5;

    // Remove onhover triggers
    settings.simulation.animation.listenForMouseEventsOn = 'none'; 

}

// Settings profile to add prevalence information labels
function settingsProfile_PrevalenceLabels(){

    // Add function to assign change indicator
    settings.nodes.labels.indicatorUnicode = d => d.change==0 ? '' : (d.change<0 ? '\uf053' : '\uf054');
    settings.nodes.labels.indicatorColor = d => d.change<0 ? settings.links.colNeg : settings.links.colPos;
    settings.nodes.labels.indicatorPos = function(d) { return {
        x: (d.change<0 ? -settings.nodes.labels.backgroundWidth()/2.5 - 17: settings.nodes.labels.backgroundWidth()/2.25  - 17),
        y: d.circleRadius + settings.nodes.labels.backgroundHeight/2.75,
    }};

    // Add extra information on prevalence
    settings.nodes.labels.extras=function(node){
        
        // Prevalence information to indicate current prevalence and units
        const prevalence = node.append("g")
            .attr('class', 'extras_prevalence')
            .attr('transform', `translate(
                ${0},
                ${settings.nodes.labels.backgroundPosY + settings.nodes.labels.backgroundHeight + 1})`
            );
        
            // Prevalence bar 
            prevalence.append("rect") // Bar background
                .attr('id', d=>`prevBG_${d.id}`)
                .attr("rx", 6)
                .attr("ry", 6)
                .attr("x", -settings.nodes.labels.backgroundWidth()/2)
                .attr("y", 0)
                .attr("width", settings.nodes.labels.backgroundWidth)
                .attr("height", settings.nodes.labels.backgroundHeight * 0.6)
                .attr("stroke", 'none')
                .attr("stroke-width", '1px')
                .attr("fill", 'ghostwhite');
            
            prevalence.append("rect") // Progress bar
                .attr('id', d=>`prevBar_${d.id}`)
                .attr("rx", 6)
                .attr("ry", 6)
                .attr("x", -settings.nodes.labels.backgroundWidth()/2)
                .attr("y", 0)
                .attr("width", d=>Math.max(settings.nodes.labels.backgroundWidth()/2 + d.change, 0))
                .attr("height", settings.nodes.labels.backgroundHeight * 0.6)
                .attr("stroke", 'none')
                .attr("stroke-width", '1px')
                .style("fill", d=>settings.nodes.labels.prevalenceBarColorScheme(d));

            prevalence.append("text") // Bar text
                .attr('id', d=>`prevTxt_${d.id}`)
                .text('0% change')
                .style("font-size", settings.nodes.labels.fontSize * 0.6)
                .style("font-family", settings.nodes.labels.font)
                .style("cursor", 'default')
                .style("user-select", 'none')
                .style("fill", 'black')
                .style("stroke", settings.nodes.labels.outlineColor)
                .style("stroke-width", settings.nodes.labels.outlineWidth)
                .attr('text-anchor', settings.nodes.labels.anchor)
                .attr('x', 0) // Offset from node by radius with padding
                .attr('y', settings.nodes.labels.backgroundHeight/2);

            
            // Badge to indicate increase or decrease in value
            prevalence.append("text")
                .attr("id", d=>`badge_${d.id}`)
                .text(d=>settings.nodes.labels.indicatorUnicode(d))
                .style("fill", d=>settings.nodes.labels.indicatorColor(d))
                .attr("dx", d=>settings.nodes.labels.indicatorPos(d).x)
                .attr("dy", d=>settings.nodes.labels.indicatorPos(d).y)
                .attr('font-family', 'Font Awesome 5 Free')
                .attr('font-weight', 900)
                .attr('class', 'fa shadow')
                .attr('text-anchor', 'middle')
                .style("font-size", settings.nodes.labels.fontSize*0.75)
                .style("cursor", 'default')
                .style("user-select", 'none')
                .attr('text-anchor', 'middle'); 

    }
}

// Settings profile to add IDs to labels
function settingsProfile_showIDs(){

    // Show IDs alongside labels
    settings.nodes.labels.content = function(d){return `${d.label} (${d.id})`};
    settings.nodes.labels.fontSize = 14;

    // Enable auto-update from defaults
    settings.simulation.autoUpdate = true; // Enable force-tick auto updating of graph to and ensure it stays updated as nodes are changed
}