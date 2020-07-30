/*

Graph settings
==============
Description:
This page contains settings present for the MiRANA graph.

Use:
The main script will use these to style the graph.

*/


/* Settings */

var settings = {
	data:{
		hideUnusedNodes: true,
		cleaning:{
			enabled: true,
			removeHyphens: true, // Data cleaning, removes hyphens from IDs
			removeMRBaseId: true, // Remove MR base ID from name (e.g., default R output name)
			removeCategory: true, // Remove identified categories following structure typical for UKB variables (cat:name)
			shorten: true, // Shorten names if over n chars
		},
		betaRange: null, // Range of beta weights in data set, used for scaling edges and in legend
	},
	nodes: {
		shape: 'circle',
		circleRadius: 15,
		strokeColor: 'rgba(0, 0, 0, 0.9)',
		strokeWidth: 2,
		fill: 'white',
		opacity: 1,
		labels: {
			enabled: true,
			font: 'Rubik, sans-serif',
			content: d => d.label,
			posX: 19, // Node radius + padding
			posY: 6, // Center text vertically on node
			anchor: 'none', // Special placement of text
			fontSize: '19px',
			textClass: '', // Gives labels a custom CSS class
		},
		icons: {
			enabled: false,
			size: 50,
			position : -25,
		}
	},
	links: {
		colNeg: 'blue',
		colPos: 'red',
		opacity: 0.5,
		scaleToBeta:{
			method: 'none',
			minWidth: 0.5, // Minimum scaled edge width 
			scaleFactor: 2, // Factor to scale beta by (e.g., the value to apply a +70% scale to)
			calcScaledWidth: function(b){return(settings.links.scaleToBeta.minWidth+(b*settings.links.scaleToBeta.scaleFactor));}, // Method to calculate scale
		},
		colorEdge: function(b, c1, c2){if(b<0){return(c1);}else{return(c2);}},
		color: d => settings.links.colorEdge(d.b, settings.links.colNeg, settings.links.colPos),
		width: 2,
		bidirectional:{
			enabled: true,
			lineOffset: 2, // Offset for each line in bidirectional links
			calcLineOffset: function(bidirectional){switch(bidirectional){case '1st': return(settings.links.bidirectional.lineOffset); case '2nd': return(settings.links.bidirectional.lineOffset*-1); default: return(0);}},
		},
	},
	arrows: {
		enabled: true,
		position: function(){return(settings.nodes.circleRadius)},
		size: 7,
		sameColorAsEdge: true, // Used by legend builder
		stroke: d=>d.col, // Color by edge color
		fill: d=>d.col,
		arrowType: d=>settings.arrows.selectArrow(d.b),
		selectArrow: function(b){if(b<0){return('url(#end-neg)')}else{return('url(#end-pos)')}},
	},
	simulation: {
		strength: -2000, // Higher values = less cohesion
	},
}