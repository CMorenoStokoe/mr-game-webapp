/*

Graph from json
==============
Description:
This file contains functions to generate a MiRANA graph in a more flexible manner from just JSON input. 

Use:
This file can be called to generate a MiRANA visualisation without uploading CSV data.

*/

// Generate graph without uploading CSV, straight from JSON
function generateGraphFromJSON(nodes, edges, svgId, settings, pval=null){ 
    // Reset SVG to clear any previous graphs
    clearFDG(svgId);

    // Data cleaning and formatting
        
        // Add source and target fields
        edges = formatForD3(edges); 

        // Filter edges by pvalue threshold if desired
        if(pval){edges = filterByPval(edges, pval)};

        // Filter out self loop edges
        edges = removeSelfloopEdges(edges);
        
        // Detect, mark and display bidirectional edges differently
        edges = markBidirectionalEdges(edges); 
        
        // Scale edges to beta weights (if enabled)
        if(!(settings.links.scaleToBeta.method=='none')){
            settings.data.betaRange = getBetaRange(edges);
            makeEdgeBetasProportional(edges, settings.data.betaRange, settings.links.scaleToBeta.method); // Scale edges by their beta weight proportional to the min/max beta values in the data set
        }

    data = {nodes: nodes, links: edges}; // Format expected by D3 graphing utility

    // Draw graph
    drawFDG(data, svgId, settings); // Draw data to svg with settings

};