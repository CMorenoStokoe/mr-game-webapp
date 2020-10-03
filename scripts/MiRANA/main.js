/*

Main script
===========
Description:
Handles the general operational structure of the app:
- Sets up event listeners to assign function to buttons on DOM
- Parse uploaded CSV data and produce visualisation

Use:
Calls functions from subservient script files and handles returned outputs to produce visualisation.

Assumptions:
Uploaded CSV contains the columns:
- 'id.exposure'
- 'id.outcome'

*/


/* Initialise DOM elements */

    // Give function to button
    addOnclickEvent("btn-action", generateGraph); // Btn to generate graph
    addOnclickEvent("btn-settings", function(){toggleVisibility('settings-panel')}); // Btn to open advanced settings panel
    
    // Set SVG height to fill window container
    svgContainerHeight = document.getElementById('film-panel').offsetHeight;
        document.getElementById('svg-main').setAttribute('height', svgContainerHeight);
    svgContainerWidth = document.getElementById('film-panel').offsetWidth;
        document.getElementById('svg-main').setAttribute('width', svgContainerWidth);

    // Use default settings
    var settings = defaultSettings;

    // Create settings buttons for changing settings
    createOptions(options, 'div-settings'); // options = list of settings options in settings-options


/* Draw graph */

//Define function to run on button press i.e., upload data, parse and pass into FDG funct
function generateGraph(){ 
    
    // Load uploaded CSV and then run function
    var fileReader = new FileReader();
    fileReader.onload = function (e) { 
        
        // Parse CSV
        var data = Papa.parse(fileReader.result)['data'];
        
        // Check data contains required information
        var requiredFields = settings.data.requiredFields;
        if(settings.data.observational){requiredFields = settings.data.requiredFieldsObs;} // If observational data expect different fields
        fields = identifyDataFields(data, requiredFields);

        // Extract MR estimate edges from CSV
        var edges = extractEdges(data);
        console.log('Edges', edges)

        // Ignore directionality of observational data so it's easier to visualise
        if(settings.data.observational){edges = convertObservationalData(edges);} 
        console.log('extracted edges', edges)
        
        // Data cleaning and formatting

            // Filter edges by method
            edges = filterByMethod(edges, settings.data.mrMethods);

            // Filter edges by pvalue threshold
            edges = filterByPval(edges, document.getElementById("pval_limit").value);

            // Filter out self loop edges
            edges = removeSelfloopEdges(edges);

            // Make names display and js friendly (if enabled)
            if(settings.data.cleaning.enabled==true){edges = makeNamesSafe(edges);}

            // If using observational data
            if(settings.data.observational){

                // Don't display causal direction arrows
                settings.arrows.enabled = false;

                // Mark multiedges and set their offset differently (if enabled)
                markMultiEdges(edges);
            
            } else { // If using causal data
                
                // Detect, mark and display bidirectional edges differently (if enabled)
                markBidirectionalEdges(edges);
            }
            
            // Scale edges to beta weights (if enabled)
            if(!(settings.links.scaleToBeta.method=='none')){
                settings.data.betaRange = getBetaRange(edges);
                makeEdgeBetasProportional(edges, settings.data.betaRange, settings.links.scaleToBeta.method); // Scale edges by their beta weight proportional to the min/max beta values in the data set
            }

        // Extract nodes
        nodes = extractNodes(edges);

        // Clear gray film over canvas area
        clearDecorativeFilm('film-panel', 'film-text', 'film-logo');

        // Format edges and nodes for D3
        edges = formatForD3(edges); // Add source and target fields
        data = {nodes: nodes, links: edges}; // Format expected by D3 graphing utility

        // Draw graph
        clearFDG('#svg-main'); // Clear any already drawn graphs from SVG
        drawFDG(data, '#svg-main', settings); // Draw data to svg with settings
        
        // Draw legend
        resetLegend('legend');
        createLegend('legend', 'div-legend', settings)

        // Hide settings panel
        setVisibility('settings-panel', 'hidden');

        // Make data downloadable as JSON
        makeJSONSavable(settings.data.fields, 'save-button-json', data);
        
    };

    // Get most recent file uploaded and invoke above function
    fileReader.readAsText(document.getElementById('upload-mr').files[0]);

};