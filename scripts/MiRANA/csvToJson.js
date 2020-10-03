/*

CSV to JSON
===========
Description:
Functions to parse an array of CSV rows (parsed CSV) into a JSON list of dictionary entries for each row.

Use:
Called by main to parse CSV into JSON formatted for graphing.

*/


// Function to extract edges from csv
function extractEdges(csv){

    // Seperate csv header from body
    const header = csv[0];
    const body = csv.slice(1);
    console.log(csv)

    // Construct list of dictionaries of properties for each cell in each row of the CSV
    const edges = [];
    for (const row in body) {
        blankContents = false;
            
        // Skip undefined rows
        if(body[row] == undefined || body[row] == ' ' || body[row] == null || body[row] == ''){console.log('Blank row removed', body[row]); continue;};

        // Initiate cell information dictionary with ID
        const cellInfo = {id: row}; 
        
        // Populate dictionary with additional properties in each row
        for(const cell in body[row]){

            // Skip rows with ANY empty cells
            if(body[row][cell] == undefined || body[row][cell] == ' ' || body[row] == null || body[row] == ''){
                blankContents = true; 
                console.log('Row with blank cell(s) removed', body[row][cell]);
                break;
            }

            // Add dictionary with key = col header name : value = cell contents
            cellInfo[header[cell]] = body[row][cell];
        }

        if(!(blankContents)){edges.push(cellInfo)}; // Add dict to list if does NOT contain blank cell(s)

    }
    return(edges);
}

// Function to convert observational data into the format expected by MiRANA
function convertObservationalData(edges){
    var nodeIDs = {};
    var counter=0;

    for(const edge of edges){

        if(nodeIDs[edge.measurex] == undefined){
            nodeIDs[edge.measurex] = `node${counter}`;
            counter++;
        }

        if(nodeIDs[edge.measurey] == undefined){
            nodeIDs[edge.measurey] = `node${counter}`;
            counter++;
        }

        edge.exposure = edge.measurex;
        edge.outcome = edge.measurey;
        edge['id.exposure'] = nodeIDs[edge.measurex];
        edge['id.outcome'] = nodeIDs[edge.measurey];
        edge.b = edge.effectSize;
    }

    return(edges)

}

// Return fields in csv
function identifyDataFields(csv, requiredFields){
    const fields = [];
    
    // Seperate csv header and body
    const header = csv[0]; 
    const body = csv.slice(1);

    // Identify fields in header
    for (const [key, value] of Object.entries(header)) {
        fields.push(value);
    }

    // Check data for errors and display to user
    checkForErrors(requiredFields, fields, body, header);    

    // Save header fields
    settings.data.fields = fields;

    // Return fields
    return(fields)
}


// Check data for errors and display errors to user
function checkForErrors(requiredFields, fields, body, header){
    errors=[];
    
    // Check all required fields are given
    for(const field of requiredFields){
        if(!(fields.includes(field))){errors.push(`Field not found in data file: ${field}`);}
    }

    // Check data is longer than 1 rows
    if(header[0]==''){errors.push('First column in header in data file is blank')}

    // Check data is longer than 1 rows
    if(body[0][0]==''){errors.push('First cell below header in data file is blank')}

    // If errors found
    if(errors.length > 0){
        
        // Add errors to pop-up modal
        content="<ul>";
        for(const error of errors){
            content += `<li>${error}</li>`;
        }
        document.getElementById('modal-text').innerHTML = content;

        // Trigger Modal
        $('#modal-errors').modal('show');
    }
}

// Make JSON format of data savable
function makeJSONSavable(edgeDataFields, btnId, data){
    
    // Add node and edge data fields to list of fields we want json stringify to find
    dataFields = edgeDataFields.concat(['edgeCount', 'edges', 'id', 'label', 'nodes', 'links']); 
    
    // Form text file from json
    var jsonFile = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, dataFields));

    // Append file to link in download button
    document.getElementById(btnId).setAttribute("href",    jsonFile    );
}