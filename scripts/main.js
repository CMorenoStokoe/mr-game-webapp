/*
Main script
---------------

Intended purpose of this script:
- Build the graphical user interface (GUI)
- Facilitate gameplay controls and amend gameData as required

Contents of this script:
- Initialisation
    Functions which only run once at the start to initialise the GUI and gameplay

- Interactive gameplay functions
    Functions which run multiple times, triggered on player interactions (e.g., enacting policies)

Encapsulation:
- This master file runs functions found in other script files containing 
collections of methods categorised by purpose.

*/

// Gamestates
var gameState = 1;

const leagues = {
    1 : {
        name: 'bronze',
        pval: 0.00000000000000005,
    },
    2 : {
        name: 'silver',
        pval: 0.00000000000000005,
    },
    3 : {
        name: 'gold',
        pval: 0.00000000000000005,
    },
    4 : {
        name: 'platinum',
        pval: 2.770083102493075e-5,
    },
}

function initialise(){

/* Initialise gameData */
    var pValueThreshold = leagues[gameState].pval;
    var gameData = initialiseData(jsonData.nodes, jsonData.links, pValueThreshold);
    
/* Initialise GUI */

    // Set SVG height to fill window container
    svgContainerHeight = document.getElementById('svg-container').offsetHeight;
        document.getElementById('svg-main').setAttribute('height', svgContainerHeight);
    svgContainerWidth = document.getElementById('svg-container').offsetWidth;
        document.getElementById('svg-main').setAttribute('width', svgContainerWidth);

    // Initialise graph with pval = bonferroni, settings = mirana + settings.js modifications
    generateGraphFromJSON(gameData.toD3().nodes, gameData.toD3().links, '#svg-main', settings, pValueThreshold); 

    // Set objective
    setText('goal', `Raise ${gameData.objective.label}`);
    
    // Create display panels (using Panel class, giving ID & side of screen)
    const leftPanel = new Panel('panel-left', 'left');


/* Initialise controls */

    // Panel close buttons
    addOnclickEvent('btn-x-leftPanel', function(){leftPanel.close();});

    // Add onclick function to bring up node information
    d3.selectAll('g').on("click", function(){
        if(this.id){

            // Reset policy panel
            setHTML('policyEffects-decreases', null); setHTML('policyEffects-increases', null);

            // Find information on the selected node
            var node = gameData.nodes[this.id];

            // Populate with node information
            const title = document.getElementById('panel-policy-title') ;
                title.innerHTML = node.label;
            const subtitle = document.getElementById('panel-policy-subtitle');
                subtitle.innerHTML = node.id;
            const icon = document.getElementById('panel-policy-icon');
                icon.src = this.childNodes[1].href.baseVal; // Get image href of this node's icon

            // Display outgoing effects from this edge
            outGoingEdgeCount = 0;

            for(const edge of node.edges){
                
                // Color effects differently if it is an increase or decrease and append to a corresponding column in policy panel
                switch(edge['id.exposure']){

                    case node.id: outGoingEdgeCount++;
                        
                        // Add text to policy effects detailing this relationship
                        if(Number(edge.b)<0){
                            createP(`policyEffect${edge.outcome}`, `${edge.outcome} <i class="fas fa-sort-down col-neg"></i>`, 'policyEffects-decreases');
                        } else if (Number(edge.b)>=0){
                            createP(`policyEffect${edge.outcome}`, `${edge.outcome} <i class="fas fa-sort-up col-pos"></i>`, 'policyEffects-increases');}
                    
                    default:
                        break;
                }
            }
            
            if(outGoingEdgeCount==0){
                createP(`policyEffectNone-incr`, `- None -`, 'policyEffects-decreases', 'policyEffect-none');
                createP(`policyEffectNone-decr`, `- None -`, 'policyEffects-increases', 'policyEffect-none');
            }
            
            // Open node info panel 
            leftPanel.open(); 
        }
    })

    // Intervention button
    /*        

    addEventListener('#btn-x-rightPanel', function(){
        runPropagation(testData.G, 'A', '1');
    });
    */

};    

// On window load, initialise
window.onload = initialise();