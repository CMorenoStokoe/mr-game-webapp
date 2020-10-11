/*

Policy effects read-out
=======================
Description:
This file contains functions to display in text form
the effects of interventions

Use:
If required, the main scripts will call this function
to display on the DOM to the users a list of intervention
effects

*/


// Function to display policy effects
function showPolicyEffects(effects){

    // Clear previous effects
    document.getElementById('policyEffects-sideeffects').innerHTML = '';

    // Show effects
    $('#GUI-policyEffects').show();

    var count = 0;
    // Show side-effects
    for(const [key, value] of Object.entries(effects)){

        // Show the main objective differently
        if(key == gameData.objective.id){
            document.getElementById('GUI-goal-p').style.background = 'green';
            $('#goal-success').show();
            continue;
        } 

        // Create trait effect bubble showing trait effect
        constructTraitEffectBubble(key, value, `policyEffect-${count}`, 'policyEffects-sideeffects');
        
        // Fade in
        $(`#policyEffect-${count}`).animate({opacity: 1}, 500 + (500*count));

        // Increment count
        count++;
    }  
}

// Function to construct a trait effect bubble
function constructTraitEffectBubble(nodeId, b, bubbleId, parentId, tense='past'){

    // Get node information
    const node = gameData.nodes[nodeId];
    
    // Div containing effect information
    var div = document.createElement('DIV');
        div.className = 'policyEffect m-2';
        div.id = bubbleId;
    document.getElementById(parentId).appendChild(div);
    
    // Trait icon
    var img = document.createElement('IMG');
        img.src = node.icon;
        img.className = 'policyEffect-img'
    div.appendChild(img);

    // Determine effect direction
    var effectDirection = 'Raised'; 
    var effectDirectionIcon = `fas fa-angle-up col-pos m-1`; 
        if(b<0){
            effectDirection = 'Lowered';
            effectDirectionIcon = 'fas fa-angle-down col-neg m-1'
        };
        if(tense=='future'){
            if(b<0){effectDirection = 'Lower'}
            else {effectDirection = 'Raise'};
        }
        
        // Effect direction indicator
        var i = document.createElement('I');
            i.className = effectDirectionIcon;
        div.appendChild(i);
    
        // Trait name
        var span = document.createElement('SPAN');
            span.innerText = ` ${effectDirection} ${node.label}`;
        div.appendChild(span);

}
