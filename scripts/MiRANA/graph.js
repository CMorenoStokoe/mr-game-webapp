/*

Force-Directed Graph (FDG) Visualisation
==================================
Description:
This file contains functions for creating and customising a FDG designed for MR data.
- Clear graph
- Draw graph

Use:
The main script will call this function, and pass in options for customisation, when it requires a new graph to be drawn.

*/

// Clear FDG
function clearFDG(svgId){
		
	// Select SVG on DOM
	const svg = d3.select(svgId);

	//Clear
	svg.selectAll("*").remove();
}

// Draw FDG
function drawFDG (data, svgId, settings) {

	// Map data
	var links = data.links;
	var nodes = data.nodes;
	
	// Select SVG DOM element
	const svg = d3.select(svgId),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
		viewBox = +svg.attr("viewBox", `0 0 ${width} ${height}`);
    console.log(`Got SVG (${width} x ${height})`);

	// Set up simulation 
	const center = [width-100, height-100];
	const simulation = d3.forceSimulation(nodes)
		.force("link", d3.forceLink(links).id(d => d.id))
		.force("charge", d3.forceManyBody().strength(settings.simulation.strength))
		.force("center", d3.forceCenter(center[0] / 2, center[1] / 2))
		.force("x", d3.forceX())
		.force("y", d3.forceY());

		
	// Add edge outlines below edges (if enabled)
	var linkOutline = null;
	if(settings.links.outline){
		linkOutline = svg.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(links, d => d.id)
		.join(
			enter => enter.append("line")
				.attr("id", d => `edge_${d.id}_outline`)
				.attr("biDirectAdjust", d => d.biDirectAdjust)
				.attr("stroke-width", settings.links.outlineWidth)
				.attr("stroke", settings.links.outlineColor) 
				.attr("stroke-opacity", settings.links.opacity / 2) 
				.attr("marker-end", settings.links.outlineArrow),
		);
	}

	// Add edges
	const link = svg.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(links, d => d.id)
		.join(
			enter => enter.append("line")
				.attr("id", d => `edge_${d.id}`)
				.attr("biDirectAdjust", d => d.biDirectAdjust)
				.attr("stroke-width", settings.links.width)
				.attr("stroke", settings.links.color) 
				.attr("stroke-opacity", settings.links.opacity) 
				.attr("marker-end", settings.arrows.arrowType),
	);

	// Add nodes
	const node = svg.append("g")
		.attr("class", "nodes")
		.selectAll("g")
		.data(nodes)
		.attr("className", settings.nodes.class)
		.join(
			enter => enter.append("g")
			.attr("id", d => d.id)
		)
		.call(drag(simulation));

	// Add node circles
	const circles = node.append("circle")
		.data(nodes)
		.attr("r", settings.nodes.circleRadius)
		.attr("stroke", settings.nodes.strokeColor)
		.attr("fill", settings.nodes.fill)
		.attr('opacity', settings.nodes.opacity)
		.attr("stroke-width", settings.nodes.strokeWidth);

	// Add icons to nodes (if enabled)
	if(settings.nodes.icons.enabled == true){
			
		var images = node.append("svg:image")
			.attr("xlink:href",  function(d) { return d.icon;})
			.attr("x", settings.nodes.icons.position)
			.attr("y", settings.nodes.icons.position)
			.attr("height", settings.nodes.icons.size)
			.on("mouseenter", mouseover)
			.on("mouseleave", mouseout)
			.on('mouseenter.fade', fade(0.1))
			.on('mouseleave.fade', fade(1))
			.attr("width", settings.nodes.icons.size);
	}

	// Add rectangle for node label background (if enabled)
	if(!(settings.nodes.labels.background == 'none')){
		
		const circles = node.append("rect")
			.attr("rx", 12)
			.attr("ry", 12)
			.attr("x", -(settings.nodes.circleRadius*2 + 6))
			.attr("y", settings.nodes.circleRadius*2)
			.attr("width", settings.nodes.circleRadius*4 + 12)
			.attr("height", 25)
			.attr("stroke", 'black')
			.attr("stroke-width", '1px')
			.attr("fill", settings.nodes.labels.background)
			.attr('opacity', 0.9)
			.attr('class', 'nodeLabel_bg');

	}

	// Add node labels (if enabled)
	if(settings.nodes.labels.enabled){
		
		var nodeText = node.append("text")
		.text(settings.nodes.labels.content)
		.style("font-size", settings.nodes.labels.fontSize)
		.style("font-family", settings.nodes.labels.font)
        .style("cursor", 'default')
		.style("user-select", 'none')
		.style("fill", settings.nodes.labels.color)
		.attr("class", settings.nodes.labels.class)
		.attr('text-anchor', settings.nodes.labels.anchor)
		.attr('x', settings.nodes.labels.posX) // Offset from node by radius with padding
		.attr('y', settings.nodes.labels.posY);

	}
	
	// Add arrows (if enabled)
	if(settings.arrows.enabled){

		// Add arrow to SVG defs for lines to use at the end
		svg.append("svg:defs").selectAll("marker")
		.data([ // Arrow ends for positive and negative links
			{id: "end-pos", col: settings.links.colPos, d:"M 0,-3 L 5,0 L 0,3", wgt: 0, pos:0},
			{id: "end-neg", col: settings.links.colNeg, d:"M 0,-3 L 5,0 L 0,3", wgt: 0, pos:0},
			{id: "end-pos-bi", col: settings.links.colPos, d:"M 0,-3 L 5,0 L 0,0", wgt: 0, pos:0}, 
			{id: "end-neg-bi", col: settings.links.colNeg, d:"M 0,-3 L 5,0 L 0,0", wgt: 0, pos:0},
			{id: "end-pos_outline", col: settings.links.outlineColor, d:"M 0,-3 L 5,0 L 0,3", wgt: -0, pos:1.5},
			{id: "end-neg_outline", col: settings.links.outlineColor, d:"M 0,-3 L 5,0 L 0,3", wgt: -0, pos:1.5},
			{id: "end-pos-bi_outline", col: settings.links.outlineColor, d:"M 0,-3 L 5,0 L 0,0", wgt: -0, pos:1.5}, 
			{id: "end-neg-bi_outline", col: settings.links.outlineColor, d:"M 0,-3 L 5,0 L 0,0", wgt: -0, pos:1.5},
		])     
		.enter().append("svg:marker")
		 // Do not scale arrow to edge width, causes positioning troubles
			.attr("id", d=>d.id) // Populated from given id in data above
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", d=>settings.arrows.position-d.pos)
			.attr("refY", 0)
			.attr("markerWidth", d=>d.wgt + 8) 
			.attr("markerHeight", d=>d.wgt + 8) 
			.attr("stroke", settings.arrows.stroke) // Either fixed or by edge color using data above
			.attr("fill", settings.arrows.fill) // Either fixed or by edge color using data above
			.attr("orient", "auto")
			.attr('opacity', d=>d.opacity * settings.links.opacity)
			.append("svg:path")
			.attr("d", d=>d.d);
	};
	  
	// Simulation properties
	simulation
		.on("tick", ticked);
		
	function ticked() {

	if(settings.links.outline){
		
		linkOutline // Draw edge outline to changing node edges
			.attr("x1", d => getNodeEdge(d, outline=true).x1)
			.attr("y1", d => getNodeEdge(d, outline=true).y1)
			.attr("x2", d => getNodeEdge(d, outline=true).x2)
			.attr("y2", d => getNodeEdge(d, outline=true).y2);
	}

	link // Draw arrows to changing node edges (Adapted from: https://stackoverflow.com/questions/15495762/linking-nodes-of-variable-radius-with-arrows?rq=1)
		.attr("x1", d => getNodeEdge(d).x1)
		.attr("y1", d => getNodeEdge(d).y1)
		.attr("x2", d => getNodeEdge(d).x2)
		.attr("y2", d => getNodeEdge(d).y2);

		// Calculate line position to edge of node circles
		function getNodeEdge(d, outline = false) {
			var sourceX = d.source.x;
			var sourceY = d.source.y;
			var targetX = d.target.x;
			var targetY = d.target.y;
		
			var theta = Math.atan((targetX - sourceX) / (targetY - sourceY));
			var phi = Math.atan((targetY - sourceY) / (targetX - sourceX));

			// Custom function to return circle radii
			function getCircleRadii(d){
				var outlineOffset = 0;
				if(outline){outlineOffset = -(d.b_pct*settings.links.scaleToBeta.scaleFactor/100/2)+1;}

				var sourceR = d3.selectAll("circle")
					.filter(function(i) {return i.id == d.source.id;})
					.attr('r');
				var targetR = d3.selectAll("circle")
					.filter(function(i) {return i.id == d.target.id;})
					.attr('r');
				return({source: sourceR - outlineOffset, target: targetR - outlineOffset})
			}

			// Get circle radii
			circleRadii = getCircleRadii(d);

			var sinTheta = circleRadii.source * Math.sin(theta);
			var cosTheta = circleRadii.source * Math.cos(theta);
			var sinPhi = circleRadii.target * Math.sin(phi);
			var cosPhi = circleRadii.target * Math.cos(phi);

			// Set the position of the link's end point at the source node
			// such that it is on the edge closest to the target node
			if (d.target.y > d.source.y) {
				sourceX = sourceX + sinTheta;
				sourceY = sourceY + cosTheta;
			}
			else {
				sourceX = sourceX - sinTheta;
				sourceY = sourceY - cosTheta;
			}
		
			// Set the position of the link's end point at the target node
			// such that it is on the edge closest to the source node
			if (d.source.x > d.target.x) {
				targetX = targetX + cosPhi;
				targetY = targetY + sinPhi;    
			}
			else {
				targetX = targetX - cosPhi;
				targetY = targetY - sinPhi;   
			}
		
			
			// Return coords in x,y
			return ({x1: sourceX, y1:sourceY, x2:targetX, y2:targetY});
			//return([sourceX,sourceY,targetX,targetY])
		}

	node // Ensure nodes cannot leave SVG
		.attr("transform", d => `translate(
			${
				Math.max(settings.nodes.circleRadius*2, 
				Math.min(width - settings.nodes.circleRadius*2, d.x)) 
			}, 
			${
				Math.max(settings.nodes.circleRadius, 
				Math.min(height - settings.nodes.circleRadius, d.y))
			}
		)`);
	}
	
	
	// Enlarge nodes on mouse over
	function mouseover() {

		// If enabled
		if(settings.simulation.animation.hoverToEnlarge){

			// Update simulation for edges to react to different circle sizes
			const timer = setInterval(function(){simulation.tick(); ticked();}, 10);
			setTimeout(function(){clearTimeout(timer);}, 300);
			
			// Animations
			d3.select(this.parentNode).select("circle").transition() // Circle animation
				.duration(300)
				.attr("r", settings.nodes.onHover.enter.calcCircleRadius);
			d3.select(this.parentNode).select("image").transition() // Icon animation
				.duration(300)
				.attr("x", settings.nodes.onHover.enter.calcIconPosition)
				.attr("y", settings.nodes.onHover.enter.calcIconPosition)
				.attr("height", settings.nodes.onHover.enter.calcIconSize)
				.attr("width", settings.nodes.onHover.enter.calcIconSize);
			d3.select(this.parentNode).select("text").transition() // Label animation
				.duration(300)
				.style("opacity", 1)
			d3.select(this.parentNode).select("rect").transition() // Label background rect animation
				.duration(300)
				.style("opacity", 1)
		}
	}

	// Return to normal size
	function mouseout() { 
		
		// If enabled
		if(settings.simulation.animation.hoverToEnlarge){

			// Update simulation for edges to react to different circle sizes
			const timer = setInterval(function(){simulation.tick();ticked();}, 10);
			setTimeout(function(){clearTimeout(timer);}, 300);

			// Animations
			d3.select(this.parentNode).select("circle").transition() // Circle animation
				.attr("fx", d=>d.x + 1)
				.duration(300)
				.attr("r", settings.nodes.onHover.exit.calcCircleRadius);
			d3.select(this.parentNode).select("image").transition() // Icon animation
				.duration(300)
				.attr("x", settings.nodes.onHover.exit.calcIconPosition)
				.attr("y", settings.nodes.onHover.exit.calcIconPosition)
				.attr("height", settings.nodes.onHover.exit.calcIconSize)
				.attr("width", settings.nodes.onHover.exit.calcIconSize);

			// Make labels transparent again on reduction (if enabled)
			if(settings.simulation.animation.hoverToEnlarge_opacity){
				d3.select(this.parentNode).select("text").transition() // Label animation
					.duration(300)
					.style("opacity", 0)
				d3.select(this.parentNode).select("rect").transition() // Label background rect animation
					.duration(300)
					.style("opacity", 0);
			}
		}
	}
		

	/* On-hover fade module (adapted: https://bl.ocks.org/almsuarez/baa897c189ed64ba2bb32cde2876533b) */
	// Utilities to get links and connections of nodes
	const linkedByIndex = {};
		links.forEach(d => {
			linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
	});
	function isConnected(a, b) {
		return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
	}
	//Fade rules for hovering over nodes
	function fade(opacity) {
		return d => {
		node.style('opacity', function (o) {
			const thisOpacity = isConnected(d, o) ? 1 : opacity;
			this.setAttribute('opacity', thisOpacity);
			return thisOpacity;
		});
		
		// Make lines transparent
		link.style('opacity', o => (o.source === d || o.target === d ? 1 : opacity));

		if(settings.links.outline){
			// Make line outlines transparent too (if enabled)
			linkOutline.style('opacity', o => (o.source === d || o.target === d ? 1 : opacity));
		};

		}
	}

	/* Drag functionality module (from: https://bl.ocks.org/mbostock/2675ff61ea5e063ede2b5d63c08020c7) */
	function dblclick(d) {
		d3.select(this).classed("fixed", d.fixed = false);
	}
	function dragstart(d) {
		d3.select(this).classed("fixed", d.fixed = true);
	}
	// Update node position on dragging nodes around
	function drag(simulation) {

		function dragstarted(d) {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
			d3.select(this).classed("fixed", d.fixed = true);
		}

		function dragged(d) {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
			d3.select(this).classed("fixed", d.fixed = true);
		}

		function dragended(d) {
			if (!d3.event.active) simulation.alphaTarget(0);
			d.fx = d3.event.x;
			d.fy = d3.event.y;
			d3.select(this).classed("fixed", d.fixed = true);    
		}

		return d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended);
	} 

};