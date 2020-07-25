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
        data = new DataClass(data_json.nodes, data_json.edges); // Payload: nodes, edges
        
    /* Initialise GUI */

        // Initialise graph
        
        drawGraph('#svg-main', data.D3);

        // Create display panels (using Panel class, giving ID & side of screen)
        const leftPanel = new Panel('panel-left', 'left');
        const rightPanel = new Panel('panel-right', 'right');

    /* Initialise controls */

        // Panel close buttons
        //addEventListener('#btn-x-leftPanel', function(){leftPanel.close;});
        //addEventListener('#btn-x-rightPanel', function(){rightPanel.close;});

        // Intervention button
        /*
        addEventListener('#btn-x-rightPanel', function(){
            runPropagation(testData.G, 'A', '1');
        });
        */

};    