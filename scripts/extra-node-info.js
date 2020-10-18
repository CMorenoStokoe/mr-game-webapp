/*
Extra node information
==================================
Description:
Adds extra node information to the nodes in the visualisation

Use: 
Called by the main view script to add information on change and prevalence of nodes to the visualisation
*/

// Add extra node information as MiRANA visualisation settings
function addExtraNodeInformation(){
    
    settings.nodes.labels.extras=function(node){
        
        // Badge to indicate increase or decrease in value
        var badgeText = node.append("text")
            .attr("id", d=>`badge_${d.id}`)
            .attr('x', settings.nodes.circleRadius * Math.cos(45))
            .attr('y', - settings.nodes.circleRadius * Math.sin(45))
            .text(function(d) { 
                if(d.change<0){return '\uf13a' }
                else if(d.change>0){return '\uf139' }
                else{return ''}
            })
            .style("fill", function(d) { 
                if(d.change<0){return settings.links.colNeg}
                else{return settings.links.colPos};
            })
            .attr('font-family', 'Font Awesome 5 Free')
            .attr('font-weight', 900)
            .attr('class', 'fa')
            .style("font-size", settings.nodes.labels.fontSize)
            .style("cursor", 'default')
            .style("user-select", 'none')
            .attr('text-anchor', 'middle');
        
        // Prevalence information to indicate current prevalence and units

        const prevalence = node.append("g")
            .attr('class', 'extras_prevalence')
            .attr('transform', `translate(
                ${0},
                ${settings.nodes.labels.backgroundPosY + settings.nodes.labels.backgroundHeight + 1})`
            );

		const prevalenceBG = prevalence.append("rect")
            .attr('id', d=>`prevBG_${d.id}`)
			.attr("rx", 12)
			.attr("ry", 12)
			.attr("x", -settings.nodes.labels.backgroundWidth()/2)
			.attr("y", 0)
			.attr("width", settings.nodes.labels.backgroundWidth)
			.attr("height", settings.nodes.labels.backgroundHeight)
			.attr("stroke", 'none')
			.attr("stroke-width", '1px')
            .attr("fill", 'ghostwhite');
        
		const prevalenceBar = prevalence.append("rect")
            .attr('id', d=>`prevBar_${d.id}`)
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("x", -settings.nodes.labels.backgroundWidth()/2)
            .attr("y", 0)
            .attr("width", d=>Math.max(settings.nodes.labels.backgroundWidth()/2 + d.change, 0))
            .attr("height", settings.nodes.labels.backgroundHeight * 0.6)
            .attr("stroke", 'none')
            .attr("stroke-width", '1px')
            .attr("fill", 'gold');

        var prevalenceText = prevalence.append("text")
            .attr('id', d=>`prevTxt_${d.id}`)
            .text(d=>`${d.prevalence} ${d.units}`)
            .style("font-size", settings.nodes.labels.fontSize * 0.6)
            .style("font-family", settings.nodes.labels.font)
            .style("cursor", 'default')
            .style("user-select", 'none')
            .style("fill", 'black')
            .style("stroke", settings.nodes.labels.outlineColor)
            .style("stroke-width", settings.nodes.labels.outlineWidth)
            .attr('text-anchor', settings.nodes.labels.anchor)
            .attr('x', 0) // Offset from node by radius with padding
            .attr('y', settings.nodes.labels.backgroundHeight/2);

    }
}