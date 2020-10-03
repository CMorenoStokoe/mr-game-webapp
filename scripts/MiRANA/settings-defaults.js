/*

Graph settings
==============
Description:
This page contains default settings for the graph.

Use:
The main script will use these as default settings.

*/


/* Settings */

var defaultSettings = {
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
		mrMethods: ['Inverse variance weighted', 'Wald ratio'], // MR methods to display
		requiredFields: ['id.outcome','id.exposure', 'exposure', 'outcome', 'pval', 'method'],
		requiredFieldsObs: ['measurex', 'measurey', 'effectSize', 'pval'],
		fields: null, // Edge properties identified in CSV data file
		observational: false,
	},
	nodes: {
		shape: 'circle',
		circleRadius: 15,
		onHover: {
			enter:{
				calcCircleRadius: function(){return settings.nodes.circleRadius*2},
				circleRadius_min: 10,
				circleRadius_max: 50,
				calcIconSize: function(){return settings.nodes.icons.size()*2},
				calcIconPosition: function(){return -settings.nodes.circleRadius*2},
			},
			exit:{
				calcCircleRadius: function(){return settings.nodes.circleRadius},
				circleRadius_min: 10,
				circleRadius_max: 50,
				calcIconSize: function(){return settings.nodes.icons.size()},
				calcIconPosition: function(){return -settings.nodes.circleRadius},
			}
		},
		strokeColor: 'rgba(0, 0, 0, 0.9)',
		strokeWidth: 2,
		fill: 'white',
		opacity: 1,
		fillFromCSV: false,
		class: 'permanentLabels',
		labels: {
			enabled: true,
			font: 'Rubik, sans-serif',
			content: d => d.label,
			posX: 19, // Node radius + padding
			posY: 6, // Center text vertically on node
			anchor: 'none', // Special placement of text
			fontSize: '19px',
			class: '', // Gives labels a custom CSS class
			color: 'black', // Text color
			background: 'none',
		},
		icons: {
			enabled: false,
			size: function(){return(settings.nodes.circleRadius*2)},
			position : function(){return(-settings.nodes.circleRadius)},
		},
		onHover: {
			enabled: null,
			enter:{
				enabled: null,
				calcCircleRadius: null,
				calcIconSize: null,
			},
			exit:{
				enabled: null,
				calcCircleRadius: null,
				calcIconSize: null,
			},
		},
	},
	links: {
		colNeg: 'blue',
		colPos: 'red',
		opacity: 1,
		outline: false,
			outlineCalcScaledWidth: function(b){return(settings.links.scaleToBeta.minWidth+(b*settings.links.scaleToBeta.scaleFactor));}, // Method to calculate scale
			outlineWidth: d => settings.links.outlineCalcScaledWidth(d.proportionalBeta) + 1,
			outlineColor: 'black',
			outlineArrow: d=>settings.arrows.selectArrow(d.b, d.offset, outline = true),
		scaleToBeta:{
			method: 'percentOfMax',
			minWidth: 1, // Minimum scaled edge width 
			scaleFactor: 3, // Factor to scale width by beta
			calcScaledWidth: function(b){return(settings.links.scaleToBeta.minWidth+(b*settings.links.scaleToBeta.scaleFactor));}, // Method to calculate scale
		},
		colorEdge: function(b, c1, c2){if(b<0){return(c1);}else{return(c2);}},
		color: d => settings.links.colorEdge(d.b, settings.links.colNeg, settings.links.colPos),
		width: d => settings.links.scaleToBeta.calcScaledWidth(d.proportionalBeta),
		bidirectional:{
			enabled: true,
			lineOffset: 2, // Offset for each line in bidirectional links
			calcLineOffset: function(bidirectional){switch(bidirectional){case '1st': return(settings.links.bidirectional.lineOffset); case '2nd': return(settings.links.bidirectional.lineOffset*-1); default: return(0);}},
		},
		multiEdges:{
			enabled: true,
			calcLineOffset: function(numberOfLinks, currentLink){return(-numberOfLinks + (currentLink*2))},
		},
	},
	arrows: {
		enabled: true,
		position: 5,
		size: 7,
		sameColorAsEdge: true, // Used by legend builder
		stroke: d=>d.col, // Color by edge color
		fill: d=>d.col,
		arrowType: d=>settings.arrows.selectArrow(d.b, d.offset),
		selectArrow: function(b, offset, outline=false){ 
			if(outline){
				switch(true){
					case b < 0 && offset == 0: return('url(#end-neg_outline)'); // Negative uni-directional estimate
					case b >= 0 && offset == 0: return('url(#end-pos_outline)'); // Positive uni-directional estimate
					case b >= 0 && offset != 0: return('url(#end-pos-bi_outline)'); // Negative bi-directional estimate
					case b < 0 && offset != 0: return('url(#end-neg-bi_outline)'); // Positive bi-directional estimate
				}
			}else{
				switch(true){
					case b < 0 && offset == 0: return('url(#end-neg)'); // Negative uni-directional estimate
					case b >= 0 && offset == 0: return('url(#end-pos)'); // Positive uni-directional estimate
					case b >= 0 && offset != 0: return('url(#end-pos-bi)'); // Negative bi-directional estimate
					case b < 0 && offset != 0: return('url(#end-neg-bi)'); // Positive bi-directional estimate
				}
			}
		}
	},
	simulation: {
		strength: -3000, // Higher values = less cohesion
		animation: { // Enabled states
			hoverToEnlarge: true, // Animate and enlarge the node on mouseover and mouseout
			hoverToEnlarge_opacity: false, // Remove opacity changes from hover function
		},
	},
}