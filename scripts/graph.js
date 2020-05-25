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

// Update the fill and text of a node g svg element
function updateNode(id, color, radius, text){ 
  
    // Change circle color
    document.getElementById(id + '-circle').style.fill = color;
    document.getElementById(id + '-circle').setAttribute("r", radius);
    document.getElementById(id + '-text').innerHTML = text;
  
  }
  
// Change the outline style of a node g svg element
function outlineNode(id, color){

  node=document.getElementById(id + '-circle')

  // Change outline color
  node.style.stroke = color;

  currentStrokeWidth = node.getAttribute('stroke-width')
  node.style.strokeWidth = currentStrokeWidth*2;
}
  

// Build force directed network graph
function drawGraph (svgId, data) {
  
  //Get SVG and set size
  const svg = d3.select(svgId);
  width = +svg.attr("width");
  height = +svg.attr("height");
  
  // Display settings
  const graphCohesion = -2000;
  const edgeWidth = 2;
  const fontSize = "19px";
  const textShadowClass = "none";
  const circleRadius = 15;
  const arrowPlacement = 25;
  const arrowSize = 5;
  const arrowColor = 'rgba(150, 150, 150, 0.75)';
  const iconSize = "50";
  const iconPlacement = -25;

  // Draw graph
  draw(data);
  
  function draw(data){
    
    var links = data.links
    var nodes = data.nodes

    // Set up simulation 
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(graphCohesion))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    // Add links to SVG
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links, d => d.id)
      .join(
        enter => enter.append("line")
          .attr("id", d => d.id + '-line')
          .attr("stroke-width", edgeWidth)
          .attr("stroke", d => d.color)//edge color as function of beta weight sign//
          .attr("stroke-opacity", 0.75)//edge opacity as function of beta weight value//
          .style("stroke-dasharray", (d=>d.dash)) //d=>d.dash
          .attr("marker-end", "url(#end)"),
      );
    
    // Add nodes to SVG
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join(
        enter => enter.append("g"),
        update => update,
        exit => exit
            .remove(),
      )
      .call(drag(simulation));

    // Append circles to nodes on SVG
    const circles = node.append("circle")
        .attr("id", d => d.id + '-circle')
        .attr("r", circleRadius) //d => Math.abs(d.activation)*circleRadius
        .attr("stroke", "rgba(0, 0, 0, 0.9)")
        .attr("fill", "white")
        .attr("stroke-width", 2);

    // Append text to nodes on SVG
    var nodeText = node.append("text")
        .text(function(d) {
          return d.short_name;
        })
        .attr("id", d => d.id + '-text')
        .attr("class", textShadowClass)
        .style("font-size", fontSize)
        .attr('x', circleRadius + 2)
        .attr('y', 6);

    // Add arrowheads to make arrows on paths on the SVG
    svg.append("svg:defs").selectAll("marker")//edge color as function of beta weight sign//
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", arrowPlacement) // original val: 15
        .attr("refY", 0) // original val: -1.5
        .attr("markerWidth", arrowSize)  // original val: 5
        .attr("markerHeight", arrowSize) // original val: 5
        .attr("stroke", arrowColor)
        .attr("fill", arrowColor) // original val: '#999'
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");
    
    // On tick, or change, recalibrate the layout using force physics
    simulation
        .on("tick", ticked);
        
    function ticked() {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      node
          .attr("transform", d => `translate(${Math.max(circleRadius*2, Math.min(width - circleRadius*2, d.x))}, ${Math.max(circleRadius, Math.min(height - circleRadius, d.y))})`);
    }
  
    // Drag a node to fix it in place
    function dragstart(d) {
      d3.select(this).classed("fixed", d.fixed = true);
    }

    // Double click a node to unfix it
    function dblclick(d) {
      d3.select(this).classed("fixed", d.fixed = false);
    }
    
    // Drag simulation physics
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
    
  }

};