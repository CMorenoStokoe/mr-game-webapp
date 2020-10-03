/*

Data cleaning
=============
Description:
These functions are intended to clean the JSON output from CSV rows.

Use:
The main script calls these functions to:
- Make the content appropriate for display (e.g., shortening node names)
- Make the content safe for processing (e.g., removing '-' hyphens in IDs)
- Make the content display only what is requested (e.g., only links below a P-Val threshold)

*/

// Remove nodes which do not meet the pvalue threshold
function filterByPval(edges, pval){
    significantEdges=[];

    // Use given pvalue or calculate bonferroni value
    if(pval=='auto'){
        pval=0.05/edges.length; // Bonferroni value
    }else{
        pval=parseFloat(pval); // Parse given p value even if in text
    }

    // Find edges which meet pval threshold
    for(const edge of edges){
        if(edge.pval<=pval){significantEdges.push(edge);}
    }

    // Return only significant edges
    //console.log(`P filter: ${edges.length-significantEdges.length}/${edges.length} edges removed (p=${pval})`, significantEdges)
    return(significantEdges);
}


// Remove nodes without any edges
function filterByHasEdges(nodes){
    usedNodes=[];
    
    // Find number of edges per node
    for(const node of nodes){
        if(node.edgeCount>0){usedNodes.push(node);}
    }
    
    // Return only nodes which have edges
    return(usedNodes);
}


// Remove edges which have a method other than the allowed methods
function filterByMethod(edges, methods){
    var filteredEdges = [];

    if(methods = 'all methods'){return(edges)};

    // Find edge methods and remove as required
    for(const edge of edges){
        if(methods.includes(edge.method)){  
            filteredEdges.push(edge)
        }
    }

    // Return only the edges of the correct methods
    return(filteredEdges)
}


// Remove self loop edges
function removeSelfloopEdges(edges){
    var edgesWithoutSelfLoops = [];

    // Add only edges which are not self-loops to list of edges
    for(const edge of edges){
        if(!(edge.outcome == edge.exposure)){edgesWithoutSelfLoops.push(edge);};
    }

    // Return list of edges which are not self loops
    return(edgesWithoutSelfLoops); 

}

// Replace trait IDs and Names with safer ones for display and processing
function makeNamesSafe(edges){

    // For each edge in data
    for(const edge of edges){

        // Make IDs safe for processing
        for(const field of ['id.outcome', 'id.exposure']){
            edge[field] = replaceHyphens(edge[field]);
        }

        // Shorten names for better display
        for(const field of ['outcome', 'exposure']){
            edge[field] = removeMRBaseId(edge[field]); // Remove MR base ID from name (e.g., default R output name)
            edge[field] = removeCategory(edge[field]); // Remove identified categories following structure typical for UKB variables (cat:name)
            edge[field] = shorten(edge[field], 20); // Shorten if over n chars
        }
    }

    return(edges);

    // Replace hyphens with underscores ('-' --> '_')
    function replaceHyphens(name){
        if (name.includes("-")){return(name.replace('-', '_'));} 
        else {return(name)}
    }

    // Remove ID from names in MR base labels (by divider '||')
    function removeMRBaseId(name){
        if (name.includes("||")){;return(name.split("||")[0]);} 
        else {return(name)}
    }
    
    // Auto-identify categorical names (by divider ':')
    function removeCategory(name){
        if (name.includes(":")){return(name.split(":")[1]);} 
        else {return(name)}
    }
    
    // Shorten long names
    function shorten(name, maxLength){
        if (name.length > maxLength){return(name.substring(0,20)+'.');} 
        else {return(name)}
    }    
}