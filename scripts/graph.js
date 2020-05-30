/* 

Create and edit FDG graph
---------------

Intended purpose of this script:
- These functions are intended to create and edit Force-Directed Graphs

Contents of this script:
- Edit element functions
    Functions designed to directly edit g elements of force-directed graphs

- Create graph functions
    Functions designed to create force-directed graphs with SVG elements


Encapsulation:
- This is a collection of methods designed to be called from a master
file. Functions with similar purposes are grouped together. These 
functions are designed to have no dependencies other than vanilla JS. 

*/


// Change the fill and text of a node g svg element
function updateNode(id, activation, text){ 

  // Get node circle by node ID
  node=document.getElementById(id + '-circle');

  // Change node circle radius by factor 'radius'
  currentRadius = node.getAttribute('r');
  node.setAttribute('r', currentRadius*activation);
  
  // Get current circle color
  node.style.fill = d3.interpolateRdYlGn(activation);

  // Change node text
  document.getElementById(id + '-text').innerHTML = text;
}
  
// Change the outline style of a node g svg element
function outlineNode(id, color){
  
  // Get node circle by node ID
  node=document.getElementById(id + '-circle');

  // Change outline color
  node.style.stroke = color;

  // Double stroke width
  currentStrokeWidth = node.getAttribute('stroke-width');
  node.style.strokeWidth = currentStrokeWidth*2;
}  

// Build force directed network graph
function drawGraph (svgId, data) {
  
  //Get SVG and set size
  const svg = d3.select(svgId);
  width = +svg.attr('width');
  height = +svg.attr('height');
  
  // Display settings
  const graphCohesion = -2000;
  const textShadowClass = 'none';
  const circleRadius = 15;
  const edgeWidth = 2;
  const arrowPlacement = 25;
  const arrowSize = 5;
  const arrowColor = 'rgba(150, 150, 150, 0.75)';
  const iconSize = '50';
  const iconPlacement = -25;
  const colorPositive = '#d92027';
  const colorNegative = '#35d0ba';

  // Draw graph
  draw(data);
  
  function draw(data){
    
    var edges = data.edges
    var nodes = data.nodes

    // Set up simulation 
    const simulation = d3.forceSimulation(nodes)
        .force('edge', d3.forceLink(edges).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(graphCohesion))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('x', d3.forceX())
        .force('y', d3.forceY());

    // Add edges to SVG
    const edge = svg.append('g')
      .attr('class', 'edges')
      .selectAll('polyline')
      .data(edges, d => d.id)
      .join(
        enter => enter.append('polyline')
          .attr('id', d => d.id + '-line')
          .attr('stroke-width', edgeWidth)// #####TO DO##### edge color as function of beta weight sign//
          .attr('stroke', d => colorEdge(d.b))
          .attr('stroke-opacity', 1)
          .attr('marker-mid', d => colorArrow(d.b)),
      );
        
    // Add text to edges
    var text = svg.append("text")
      .attr("x", 6)
      .attr("dy", 15);

    text.append("textPath")
      .attr("stroke","black")
      .attr("xlink:href","#path1")
      .text("abc");

    // Add nodes to SVG
    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join(
        enter => enter.append('g'),
        update => update,
        exit => exit
            .remove(),
      )
      .call(drag(simulation));

    // Append circles to nodes on SVG
    const circles = node.append('circle')
        .attr('id', d => d.id + '-circle')
        .attr('r', d => Math.abs(d.activation)*circleRadius) 
        .attr('stroke', 'none')
        .attr('stroke-width', 1)
        .attr('fill', d => d3.interpolateRdYlGn(d.activation));

    // Append text to nodes on SVG
    var nodeText = node.append('text')
        .text(d => d.label)
        .attr('id', d => d.id + '-text')
        .attr('class', textShadowClass)
        .style('font-family', 'Raleway, sans-serif')
        .style('font-weight', 300)
        .style("text-anchor", "middle")
        .attr('x', 0)
        .attr('y', circleRadius * 2 + 2);

    // Add arrowheads to make arrows on paths on the SVG
    // Add arrowhead for positive beta weighted edges
    svg.append('svg:defs').selectAll('marker')//edge color as function of beta weight sign//
        .data(['end'])      // Different edge/path types can be defined here
        .enter().append('svg:marker')    // This section adds in the arrows
        .attr('id',  'end-neg')
        .attr('viewBox', '0 -5 10 10')
        .attr('refY', 0)
        .attr('markerWidth', arrowSize)
        .attr('markerHeight', arrowSize)
        .attr('stroke',  colorNegative)
        .attr('fill',  colorNegative)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
    
    // Add arrowhead for negative beta weighted edges
    svg.append('svg:defs').selectAll('marker')//edge color as function of beta weight sign//
      .data(['end'])      // Different edge/path types can be defined here
      .enter().append('svg:marker')    // This section adds in the arrows
      .attr('id', 'end-pos')
      .attr('viewBox', '0 -5 10 10')
      .attr('refY', 0) 
      .attr('markerWidth', arrowSize)  
      .attr('markerHeight', arrowSize) 
      .attr('stroke',  colorPositive)
      .attr('fill',  colorPositive) 
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
    
    // On tick, or change, recalibrate the layout using force physics
    simulation.on("tick", function() {
      edge.attr("points", function(d) {
        return d.source.x + "," + d.source.y + " " + 
               (d.source.x + d.target.x)/2 + "," + (d.source.y + d.target.y)/2 + " " +
               d.target.x + "," + d.target.y; });

      node
          .attr('transform', d => `translate(${Math.max(circleRadius*2, Math.min(width - circleRadius*2, d.x))}, ${Math.max(circleRadius, Math.min(height - circleRadius, d.y))})`);
    })
  
    // Drag a node to fix it in place
    function dragstart(d) {
      d3.select(this).classed('fixed', d.fixed = true);
    }

    // Double click a node to unfix it
    function dblclick(d) {
      d3.select(this).classed('fixed', d.fixed = false);
    }
    
    // Drag simulation physics
    function drag(simulation) {

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        d3.select(this).classed('fixed', d.fixed = true);
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        d3.select(this).classed('fixed', d.fixed = true);
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        d3.select(this).classed('fixed', d.fixed = true);    
      }

      return d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended);

    }
    
  }
    
  function colorEdge(b){
    if(b<0){
      return colorNegative;
    } else {
      return colorPositive;
    }
  }

  function colorArrow(b){
    console.log(b);
    if(b<0){
      console.log('url(#end-neg)');
      return 'url(#end-neg)';
    } else {
      console.log('url(#end-pos)');
      return 'url(#end-pos)';
    }
  }

};
