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

    /* Fill policy panel with policies from data */
    
    // Initialise graph
    drawGraph('#svg-main', data);

    /* Initialise buttons to open and close panels */

    // Create Panel class objects for each panel with ID & orientation on page
    const leftPanel = new Panel('panel-left', 'left');
    const rightPanel = new Panel('panel-right', 'right');

    // Add event listeners to buttons which use Panel class functions to close panels at startup
    addEventListener('#btn-x-leftPanel', function(){leftPanel.close;});
    addEventListener('#btn-x-rightPanel', function(){rightPanel.close;});

};

