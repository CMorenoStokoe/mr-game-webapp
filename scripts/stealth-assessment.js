/*

Test mode
=========
Mode for an in-game intervention ability test.

*/


// Effects on user choosing an answer
function userChoseAnswer(nodeId){
    playerInterventionCount ++; if(playerInterventionCount <= document.getElementById("interventions").value){
    
        // Highlight node
        highlightNode(nodeId);

        // Make intervention

            // Record intervention target
            document.getElementById('test_interventions').innerHTML += `${gameData.nodes[nodeId].label} `;

            // Infer intervention value and valence
            var interventionValue = gameData.nodes[nodeId].prevalenceIncrease;
                if(!(gameData.nodes[nodeId].isGood)){interventionValue *= -1};

            // Calculate effects
            const results = runPropagation(gameData, nodeId, interventionValue);
        
        // Score intervention
        const score  = scoreIntervention(gameData, method='test');
            document.getElementById('test_score_objective').innerText = to4SF(score.scores.objective);
            document.getElementById('test_score_goodness').innerText = to4SF(score.scores.goodness);
    
        // Record effects
        document.getElementById('test_allEffects').innerHTML += `<hr> Intervention on ${gameData.nodes[nodeId].label} <hr>`;
        for(const [nodeId, prevalenceChange] of Object.entries(results.result)){
            document.getElementById('test_allEffects').innerHTML += `${gameData.nodes[nodeId].label} changed by ${to4SF(prevalenceChange)} <br>`;
        };    
    }
}