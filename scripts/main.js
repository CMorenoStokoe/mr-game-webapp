/*
Main script
---------------

Intended purpose of this script:
- Build the graphical user interface (GUI)
- Facilitate gameplay controls and amend data as required

Contents of this script:
- Initialisation
    Functions which only run once at the start to initialise the GUI and gameplay

- Interactive gameplay functions
    Functions which run multiple times, triggered on player interactions (e.g., enacting policies)

Encapsulation:
- This master file runs functions found in other script files containing 
collections of methods categorised by purpose.

*/

window.onload = initialise();

function initialise(){

    /* Initialise data */
    
        // Populate DataClass with data
        data = new DataClass(jsonData.nodes, jsonData.links); // Payload: nodes, edges
        
    /* Initialise GUI */

        // Initialise graph
        generateGraphFromJSON(data.D3.nodes, data.D3.links, '#svg-main', settings); // settings located in graph-settings-preset file

        // Create display panels (using Panel class, giving ID & side of screen)
        const leftPanel = new Panel('panel-left', 'left');
            leftPanel.close(); // Start closed

    /* Initialise controls */

        // Panel close buttons
        addOnclickEvent('btn-x-leftPanel', function(){leftPanel.close();});

        // Intervention button
        /*        

        addEventListener('#btn-x-rightPanel', function(){
            runPropagation(testData.G, 'A', '1');
        });
        */

};    