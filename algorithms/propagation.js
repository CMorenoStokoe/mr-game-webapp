var G = new jsnx.DiGraph();
 
G.addNodesFrom([1,2,3,4,5,[9,{color: '#008A00'}]], {color: '#0064C7'});
G.addCycle([1,2,3,4,5]);
G.addEdgesFrom([[1,9], [9,1]]);
 
console.log(G)
