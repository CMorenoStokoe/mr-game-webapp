
// Data
const G = jsonData; // data/dataNew.js
G.links.forEach(e => {e.source = e['id.exposure']});
G.links.forEach(e => {e.target = e['id.outcome']});
G.links.forEach(e1=>{
    G.links.forEach(e2=>{
        if(e1.exposure == e2.outcome && e1.outcome == e2.exposure){
            const offset = settings.links.bidirectional.calcLineOffset(e1.b, e2.b);
            [e1.bidirectional, e2.bidirectional] = [true, true];
            [e1.offset, e2.offset] = [offset, -offset];
            return;
        } else if (e1.bidirectional || e2.bidirectional) {
            return;
        } else {
            [e1.offset, e2.offset] = [0,0];
        }
    })
})

// Subset data
const subset = (o, n) => {
    const links = [];
    const rng = () => { 
        const rn = Math.floor(Math.random() * (o.links.length));
        console.log('rn:', rn)
        return rn;
    };
    for(let i = 0; i < n; i++){ links.push( o.links[rng()] ) };
    return ({nodes: o.nodes, links: links});
}

// Redraw graph with new subset of data
const resample = () => {
    // Reset SVG
	const svg = d3.select('#svg-main');
	svg.selectAll("*").remove();
    // Resample and draw graph
    drawFDG(subset(G, 5), '#svg-main', settings);
}

// Controller
var btn = document.createElement('Button');
    btn.innerHTML = 'Random seed';
    btn.onclick = resample;
document.body.appendChild(btn);

resample();

/* TO-DO:
- Let my nodes go (out of the boundary)
- Dim other nodes
*/