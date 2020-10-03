/*

Edge properties
===============
Description:
This file can ammend and calculate from edge properties

Use:
This is called by the main script, given the result of processing the uploaded file and before calling it to be graph visualised.
- Calculate range of beta weights
- Identify bidirectional edges
- Format edges in D3 graph input format


*/

// Get range of edge beta weights
function getBetaRange(edges){
    console.log(edges)
    var bMin = edges[0].b;
    var bMax = 0;

    // Get absolute beta magnitudes
    for(const edge of edges){
        if(Math.abs(edge.b) > bMax){bMax = Math.abs(edge.b)};
        if(Math.abs(edge.b) < bMin){bMin = Math.abs(edge.b)};
    }

    return({min: bMin, max: bMax});
}

// Weight edges by percentage beta magnitudes
function makeEdgeBetasProportional(edges, betaRange, method){
    range = betaRange.max - betaRange.min;

    switch(method){
        case 'percentOfMax':

            // Calculate relative weight of betas compared to the min/max values to give a % of the max beta weight in the dataset
            for(const edge of edges){ // % is actually decimal value 0-1
                edge.proportionalBeta = (Math.abs(edge.b) - betaRange.min) / range; 
            }
            break;

        default: console.log('Err: Scaling method not recognised')

    }

    return (edges);
}

// Identify bidirectional relationships
function markBidirectionalEdges(edges){
    bidirectionalEdges={}

    for(const edge of edges){
        bidirectionalEdges[edge.id] = null;

        for(const edge2 of edges){

            // Identify bidirectional relationships
            if(edge.exposure == edge2.outcome && edge.outcome == edge2.exposure){

                // Record edges as bidirectional
                bidirectionalEdges[edge.id] = '1st'; // Number denotes 1st/2nd link in relationship
                bidirectionalEdges[edge2.id] = '2nd';

                break;
            }
        }
    }
    
    // Mark bidirectional relationships
    for(const edge of edges){
        edge.offset = settings.links.bidirectional.calcLineOffset(bidirectionalEdges[edge.id]);
    }

    return(edges); 
}

// Identify and offset multi-edge nodes (i.e., more than two edges per node pair e.g., observational data)
function markMultiEdges(edges){
    var multilinks = {};
    var countedEdges=[];

    // Count how many edges are exposures
    for(const edge of edges){
        var countOfLinks = 1;
        const exposure = edge['exposure'];
        const outcome = edge['outcome'];

        for(const edge2 of edges){
            const exposure2 = edge2['exposure'];
            const outcome2 = edge2['outcome'];

            // Skip already counted edges in multilinks
            if(countedEdges.includes(edge2.id)){continue;}

            // For each similar link
            if(exposure2 == exposure && outcome2 == outcome){

                // Skip self-edges
                if(exposure2==outcome2){continue;}
            
                // Index multi edges
                switch(multilinks[`${exposure},${outcome}`]){

                    case undefined:
                        multilinks[`${exposure},${outcome}`] = [];
                    
                    default:
                        multilinks[`${exposure},${outcome}`].push(edge2.id);
                        countedEdges.push(edge2.id);
                        break;
                }
            }
        }
    }
    console.log(multilinks, countedEdges)

    // Mark multiedge relationships
    for(const edge of edges){

        // If edge is part of a multilink collection, offset it appropriately
        if([`${edge.exposure},${edge.outcome}`] in multilinks){
            console.log(
                multilinks[`${edge.exposure},${edge.outcome}`].length, 
                multilinks[`${edge.exposure},${edge.outcome}`].indexOf(edge.id)
            )
            
            edge.offset = settings.links.multiEdges.calcLineOffset(
                multilinks[`${edge.exposure},${edge.outcome}`].length, 
                multilinks[`${edge.exposure},${edge.outcome}`].indexOf(edge.id)
            );

        } else {edge.offset=0}

    }

    return; 
}

// Add source and target fields for D3 formatting
function formatForD3(edges){

    for(const edge of edges){

        // Rename properties to source and target which are expected by d3
        edge.source = edge['id.exposure'];
        edge.target = edge['id.outcome'];

    }

    return(edges); 
}