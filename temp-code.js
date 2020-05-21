/* Cannibalisation in process 

Salvage of value:
- node image append function

*/
    
     var nodeImage = node.append("image")
         .attr("xlink:href", d => d.iconId)
         .attr("height", iconSize)
         .attr("width", iconSize)
         .attr("x", iconPlacement) //default=-20
         .attr("y", iconPlacement) //default=-20
         .attr("dataHolder", d => d.id)
         .on("click", function(){
              nodeId = this.getAttribute("dataHolder")
              render_alt("modal2_alt", nodeId);
              URL = "http://127.0.0.1:5000/simulation/" + nodeId;
              FDG("destruction", URL, "#svgM2", "compact");
              FDG("creation", URL,"#svgM2", "compact");
              if (debug_FDG_focus=='True'){console.log("debug_FDG_focus: circle.onclick called, retrieved node id: ", nodeId)}
        });