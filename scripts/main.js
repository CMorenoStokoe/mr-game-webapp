// Settings
const graphSettings = defaultSettings // ../mirana/scripts/settings-default;

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
    const nodes = {};
    const rng = () => { 
        const rn = Math.floor(Math.random() * (o.links.length));
        return rn;
    };
    console.log(o.links)
    for(let i = 0; i < n; i++){ 
        const link = o.links[rng()];
        links.push(link);
        for(const node of [link.source, link.target]){
            nodes[node] = o.nodes.filter((e) => e.id === node)[0]
        };
    };
    return ({nodes: Object.values(nodes), links: links});
}

// Redraw graph with new subset of data
var sampleHistory = [];
const resample = () => {
    // Clear SVG
	d3.select('#svg-main').selectAll("*").remove();
    // Copy data
    var copyOfG = JSON.parse(JSON.stringify(G));
    // Resample data
    const sample = subset(copyOfG, 1);
    // Store in sampleHistory
    sampleHistory.push(sample);
    // Draw graph to SVG
    drawFDG(sample, '#svg-main', graphSettings);
}
const previousSample = () => {
    const sample = sampleHistory[sampleHistory.length-2];
    sampleHistory.push(sample);
    if(sampleHistory.length>2){
        d3.select('#svg-main').selectAll("*").remove();
        drawFDG(sample, '#svg-main', graphSettings);
    }
}

// Controller
var btn_back = document.createElement('Button');
    btn_back.innerHTML = '< Back';
    btn_back.onclick = previousSample;
    btn_back.className = 'm-2 btn btn-light';
document.getElementById('controls').appendChild(btn_back);
var btn = document.createElement('Button');
    btn.innerHTML = 'Plausible';
    btn.onclick = resample;
    btn.className = 'm-2 btn btn-success';
document.getElementById('controls').appendChild(btn);
var btn = document.createElement('Button');
    btn.innerHTML = 'Not plausible';
    btn.onclick = resample;
    btn.className = 'm-2 btn btn-danger';
document.getElementById('controls').appendChild(btn);

// On load
window.onload = () => {
    // Configure graph settings
    graphSettings.simulation.tickLimit = 15;
    graphSettings.simulation.strength = -5000;
    graphSettings.links.width = 5;
    graphSettings.nodes.circleRadius = 25;
    graphSettings.nodes.labels.fontSize = 24;
    graphSettings.nodes.labels.posX = 30;
    graphSettings.simulation.forceViewbox = true;
    graphSettings.simulation.viewbox = {x:500, y:500};

    // Draw graph
    resample();
}

/* TO-DO:
- Let my nodes go (out of the boundary)
- Dim other nodes
*/