remove me

// options:

colorschemes = setting

	/*const color = d3.scaleSequential(d3.interpolatePiYG);
	d3.scaleOrdinal(d3.schemeCategory10);
	const links = data.links.map(d => Object.create(d));
	const nodes = data.nodes.map(d => Object.create(d));*/

shorten name = togglable; y/n
[remove?]dashed lines = togglable; given value 
node colors = given value
line color scheme = given value
bonferroni pval = togglable; y/n
different arrow types = setting;
text in node placement location = toggleable; right/center;
node size = togglable; factor*
remove unlinked nodes = togglable; y/n;

TODO: new logo
TODO: transitions for steps
BUG: fix random markers from no node? - inspect nodes and edges

shadow on label = togglable
.attr("class", settings.nodes.shad)

dash line = given value;
		intojoin://.style("stroke-dasharray", (d=>d.dash)) //d=>d.dash

removeHyphens(); // 
removeMRBaseId(); // Remove MR base ID from name (e.g., default R output name)
removeCategory(); // Remove identified categories following structure typical for UKB variables (cat:name)
shorten(); // Shorten if over n chars

node shape = given value per node
/*
	const rectangles = node.append("rect")
		.attr("r", circleRadius) //d => Math.abs(d.activation)*circleRadius
		.attr("fill", "rgba(255,255,255,0.5)")
		.attr("width", 150)
		.attr("height", 25)
		.attr('rx', 5)
		.attr('ry', 5)
		.attr('x', -75)
		.attr('y', -12.5);
    */
    
    
scale line thickness = togglable; given value (default on 'true': beta)
//d => Math.abs(d.activation)*circleRadius

icons = setting --> given value;
/*var nodeImage = node.append("image")
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
		});*/