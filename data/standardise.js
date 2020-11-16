/*

Standardise
===========
Description:
Standardises beta effects to be comparable across traits.

Use:
The main model script and data class script call these functions 
when trait effects need to be standardised.

*/

// Function to represent effects as % change in prevalence
function standardise(node){
    
    // Calculate prevalence change per unit increase in trait
    var prevalenceChangePerUnit = null;
    switch(node.units){

        // With percentage odds, a unit increase is a binary increase (i.e., giving everyone depression) so it is represented as a 100% increase/decrease
        case 'Odds (%)': prevalenceChangePerUnit = 100; interventionUnitChange; break; 

        // With SDs, each unit increase (1 SD) is modelled as a 34% shift in prevalence distribution 
        case 'SD': prevalenceChangePerUnit = 34; break;
        
        // With other units, each unit increase is converted to SD and modelled as above (1SD = 34% shift in prevalence distribution)
        default: prevalenceChangePerUnit = 34 / node.sd; break;    
    }

    // Decide how much interventions will change traits 
    var interventionUnitChange = null;
    switch(node.units){

        // With percentage odds, increase trait by 1/3 prevalence
        case 'Odds (%)': interventionUnitChange = node.average*0.33; break; 

        // With SDs, each unit increase (1 SD) is modelled as a 34% shift in prevalence distribution 
        case 'SD': interventionUnitChange = 1; break;
        
        // With other units, each unit increase is converted to SD and modelled as above (1SD = 34% shift in prevalence distribution)
        default: interventionUnitChange = node.sd; break;    
    }

    // Calculate current prevalence change in standardised units
    function standardiseCurrentPrevalence(node, prevalenceChangePerUnit){
        return (node.prevalence - node.average) * prevalenceChangePerUnit;
    }

    return({
        prevalenceChangePerUnit: prevalenceChangePerUnit,               
        interventionUnitChange: interventionUnitChange,
        prevalenceChange: standardiseCurrentPrevalence(node, prevalenceChangePerUnit),
    })
}
