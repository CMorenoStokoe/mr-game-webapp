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
            settingsProfile_PrevalenceLabels();
            break;

        case 'test':
            settingsProfile_showIDs();
            break;

        case 'game':
            settingsProfile_Default();
            settingsProfile_PrevalenceLabels();
            break;

        default: console.log(`ERROR (#2): Unknown settings profile (${profile})`); break;
    }
}

// Default settings profile 
function settingsProfile_Default(){

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

    /* Links */
    
        // Change color scheme
        settings.links.colNeg = 'cornflowerblue';
        settings.links.colPos = 'orangered';

        // Make overlapping edges more visible
        settings.links.opacity = 0.5;
        settings.arrows.opacity = 1;
        
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
    settings.links.opacity = 1;
    settings.links.scaleToBeta.minWidth = 1;
    settings.links.scaleToBeta.scaleFactor = 5;
    settings.links.scaleToBeta.scaleFactor = 5;

    // Scale more accurately to their standardised effects in propagation
    settings.links.scaleToBeta.maxWidth = settings.links.scaleToBeta.minWidth + (settings.links.scaleToBeta.scaleFactor * 5);
    settings.links.scaleToBeta.calcScaledWidth = function(b){
        const b_abs = Math.abs(b); // Make beta absolute
        const width = b_abs/100*settings.links.scaleToBeta.scaleFactor; // Calculate relative width
        return( 
            Math.min( // Scale edge width by beta within min and max limits for visibility
                settings.links.scaleToBeta.minWidth + width, 
                settings.links.scaleToBeta.maxWidth
            )
        )
    ;},settings.links.outlineCalcScaledWidth = function(b){
        const b_abs = Math.abs(b); // Make beta absolute
        const width = b_abs/100*settings.links.scaleToBeta.scaleFactor; // Calculate relative width
        return( 
            Math.min( // Scale edge width by beta within min and max limits for visibility
                settings.links.scaleToBeta.minWidth + width, 
                settings.links.scaleToBeta.maxWidth + 2
            )
        )
    ;},
    settings.links.width = d => settings.links.outlineCalcScaledWidth(d.b_pct);
    settings.links.outlineWidth = d => settings.links.scaleToBeta.calcScaledWidth(d.b_pct) + 2;

}

// Settings profile to improve the visibility of static visualisation
function settingsProfile_PermanentLabels(){
    
    // Make labels permanently visible
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
    
    settings.nodes.labels.extras=function(node){
        
        // Badge to indicate increase or decrease in value
        var badgeText = node.append("text")
            .attr("id", d=>`badge_${d.id}`)
            .attr('x', settings.nodes.circleRadius * Math.cos(45))
            .attr('y', - settings.nodes.circleRadius * Math.sin(45))
            .text(function(d) { 
                if(d.change<0){return '\uf13a' }
                else if(d.change>0){return '\uf139' }
                else{return ''}
            })
            .style("fill", function(d) { 
                if(d.change<0){return settings.links.colNeg}
                else{return settings.links.colPos};
            })
            .attr('font-family', 'Font Awesome 5 Free')
            .attr('font-weight', 900)
            .attr('class', 'fa')
            .style("font-size", settings.nodes.labels.fontSize)
            .style("cursor", 'default')
            .style("user-select", 'none')
            .attr('text-anchor', 'middle');
        
        // Prevalence information to indicate current prevalence and units

        const prevalence = node.append("g")
            .attr('class', 'extras_prevalence')
            .attr('transform', `translate(
                ${0},
                ${settings.nodes.labels.backgroundPosY + settings.nodes.labels.backgroundHeight + 1})`
            );

		const prevalenceBG = prevalence.append("rect")
            .attr('id', d=>`prevBG_${d.id}`)
			.attr("rx", 12)
			.attr("ry", 12)
			.attr("x", -settings.nodes.labels.backgroundWidth()/2)
			.attr("y", 0)
			.attr("width", settings.nodes.labels.backgroundWidth)
			.attr("height", settings.nodes.labels.backgroundHeight * 0.6)
			.attr("stroke", 'none')
			.attr("stroke-width", '1px')
            .attr("fill", 'ghostwhite');
        
		const prevalenceBar = prevalence.append("rect")
            .attr('id', d=>`prevBar_${d.id}`)
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("x", -settings.nodes.labels.backgroundWidth()/2)
            .attr("y", 0)
            .attr("width", d=>Math.max(settings.nodes.labels.backgroundWidth()/2 + d.change, 0))
            .attr("height", settings.nodes.labels.backgroundHeight * 0.6)
            .attr("stroke", 'none')
            .attr("stroke-width", '1px')
            .attr("fill", 'gold');

        var prevalenceText = prevalence.append("text")
            .attr('id', d=>`prevTxt_${d.id}`)
            .text(d=>`${d.prevalence} ${d.units}`)
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