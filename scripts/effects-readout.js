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

        // Show the main objective differently (if enabled)
        if(gameData.objective){
            if(key == gameData.objective.id){

                // Change color of progress
                document.getElementById('GUI-goal-p').style.background = 'green';
                
            } 
        }

        // Create trait effect bubble showing trait effect
        constructTraitEffectBubble(key, value, `policyEffect-${count}`, 'policyEffects-sideeffects');
        
        // Show success modal
        $('#goal-success').show();

        // Fade in effects
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
        img.id = `${bubbleId}-img`;
        img.className = 'policyEffect-img'
    div.appendChild(img);

    // Determine effect direction
    var effectDirection = 'No effect on';
    var effectDirectionIcon = 'fas fa-equals m-1';
        if(Number(b)<0){
            effectDirection = 'Lowered';
            effectDirectionIcon = 'fas fa-angle-down col-neg m-1';
        }else if(Number(b)>0){
            effectDirection = 'Raised'; 
            effectDirectionIcon = `fas fa-angle-up col-pos m-1`; 
        }
        if(tense=='future'){
            if(Number(b)<0){effectDirection = 'Lower'}
            else {effectDirection = 'Raise'};
        }
        
        // Effect direction indicator
        var i = document.createElement('I');
            i.className = effectDirectionIcon;
        div.appendChild(i);

        // Set amount of change
        var amount = '';
            if(b < 0 || b > 0){ amount = `by ${b}%`}
    
        // Trait name
        var span = document.createElement('SPAN');
            span.innerText = ` ${effectDirection} ${node.label} ${amount}`;
        div.appendChild(span);

}


// Construct policy bubble
function constructPolicyBubble(targets, objectiveId, effect, parent, policyName){

    // Container div
    var div = document.createElement('DIV');
        div.className = 'card w-100 d-flex justify-content-center align-items-center';
        div.id = `policy-${Math.random()}`;
    document.getElementById(parent).appendChild(div);


    // Header
    var header = document.createElement('DIV');
        header.className = 'w-100 d-flex flex-column text-left justify-content-around align-items-center';
        header.style.borderBottom = 'solid 0.25px #eee';
    div.appendChild(header);
    
        // Policy name
        var title = document.createElement('DIV');
            title.className = 'w-100 p-2 d-flex text-center';
            title.innerHTML = `<h5>${policyName}</h5>`;
        header.appendChild(title);

        // Subtitles
        var subtitles = document.createElement('DIV');
            subtitles.className = 'w-100 d-flex flex-row text-left justify-content-around align-items-center';
        header.appendChild(subtitles);

            // Title for interventions
            var t1 = document.createElement('P');
                t1.className = 'p-1 pl-2 mb-0 d-flex w-100 text-muted text-left';
                t1.style.fontSize = '0.75rem';
                t1.innerText = ' Interventions ';
            subtitles.appendChild(t1);

            // Title for effects
            var t2 = document.createElement('P');
                t2.className = 'p-1 mb-0 d-flex w-100 text-muted text-left';
                t2.style.fontSize = '0.75rem';
                t2.innerHTML = ' Effect on objective ';
            subtitles.appendChild(t2);

    // Body
    var body = document.createElement('DIV');
        body.className = 'w-100 d-flex flex-row justify-content-around align-items-center';
    div.appendChild(body);

        // Intervention div
        var interventions = document.createElement('DIV');
            interventions.className = 'd-flex flex-column text-left justify-content-center align-items-center';
        body.appendChild(interventions);

        // Interventions
        for(const target of targets){
            var intervention = document.createElement('DIV');
                intervention.className = 'm-1 d-flex flex-row align-items-center justify-content-center';
            interventions.appendChild(intervention);

            // Target icon
            var img = document.createElement('IMG');
                img.src = gameData.nodes[target].icon;
                img.className = 'm-2 policyEffect-img';
                img.style.height = '30px';
            intervention.appendChild(img);
            
            // Target label
            var p = document.createElement('P');
                p.innerText = gameData.nodes[target].label;
                p.className = 'my-auto';
            intervention.appendChild(p);
        }
        
        // Effect div
        var interventionEffect = document.createElement('DIV');
            interventionEffect.className = 'w-100 d-flex justify-content-center align-items-center';
            interventionEffect.id = `policy-effect-${Math.random()}`;
        body.appendChild(interventionEffect);
        
        // Intervention effects

            // Create id for bubble
            const bubbleId = `policy-intv-${Math.random()}`;

            // Create bubble using id
            constructTraitEffectBubble(
                gameData.nodes[objectiveId].id,
                to4SF(effect), 
                bubbleId, 
                interventionEffect.id,
            );

            // Format bubble icon
            
                // Calculate bubble scale
                const scale = 30 + Math.max(-10, Math.min(20, effect/5));
                
                // Get bubble hue
                var hue = '';
                    if(effect>0){
                        hue = 'invert(40%) sepia(100%) hue-rotate(-30deg) saturate(3)';
                    }else if(effect<0){
                        hue = 'invert(28%) sepia(100%) hue-rotate(-180deg) saturate(3)';
                    }

                // Format bubble icon
                var icon = document.getElementById(`${bubbleId}-img`);
                    icon.style.height = `${scale}px`;
                    icon.style.filter = hue;
}