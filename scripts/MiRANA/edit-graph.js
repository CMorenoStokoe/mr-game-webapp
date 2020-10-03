/* 

Edit FDG graph
---------------

Intended purpose of this script:
- These functions are intended to edit Force-Directed Graphs

Contents of this script:
- Edit element functions
    Functions designed to directly edit g elements of force-directed graphs

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
  node.style.fill = nodeColor(activation);

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

// Return color gradient for coloring nodes by prevalence
function nodeColor(prevalence){
  
  // Pass number between 0-1 to d3 gradient function to return color in specified gradient
  return d3.interpolateSpectral(prevalence)
}